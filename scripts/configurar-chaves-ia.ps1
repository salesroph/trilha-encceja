$ErrorActionPreference = 'Stop'
Write-Host 'Configuracao segura das chaves NVIDIA para o projeto Trilha ENCCEJA.'
Write-Host 'Cole cada chave quando solicitado. Ela nao aparece na tela nem deve ser enviada no chat.'
$first = Read-Host 'Chave NVIDIA para DeepSeek' -AsSecureString
$second = Read-Host 'Chave NVIDIA para GLM' -AsSecureString
if ($first.Length -eq 0 -or $second.Length -eq 0) { Write-Host 'Nenhuma chave foi enviada: os dois campos precisam estar preenchidos.'; exit 1 }
$onePtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($first)
$twoPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($second)
$tmpFile = $null
try {
  $one = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($onePtr)
  $two = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($twoPtr)
  if ($one.Contains("`n") -or $one.Contains("`r") -or $two.Contains("`n") -or $two.Contains("`r")) { throw 'Chave invalida: precisa caber em uma linha.' }
  $tmpFile = [IO.Path]::GetTempFileName()
  [IO.File]::WriteAllText($tmpFile, "NVIDIA_DEEPSEEK_API_KEY=$one`nNVIDIA_GLM_API_KEY=$two`n", [Text.UTF8Encoding]::new($false))
  & npx.cmd --yes supabase secrets set --project-ref osthfogyiubiieanzrkf --env-file $tmpFile --agent no --output-format text
  if ($LASTEXITCODE -ne 0) { throw 'O Supabase nao confirmou a gravacao dos segredos.' }
  Write-Host 'Chaves gravadas no Supabase. Pode avisar no chat que terminou.'
} catch {
  Write-Host 'Nao foi possivel concluir a configuracao. Avise no chat e informe apenas a mensagem de erro, sem as chaves.'
} finally {
  if ($tmpFile -and (Test-Path -LiteralPath $tmpFile)) { Remove-Item -LiteralPath $tmpFile -Force }
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($onePtr)
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($twoPtr)
  $one = $null; $two = $null
}
