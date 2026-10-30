// Ajustes de navegação: marca a tela atual, volta ao topo a cada troca de tela e destaca acertos e erros.
function markAnswers(form,correct,chosenAt){
  form.querySelectorAll('.question').forEach((question,i)=>{
    const options=question.querySelectorAll('.option'),chosen=chosenAt(i);
    options.forEach((label,j)=>{
      if(j===correct[i])label.classList.add('right');
      else if(chosen!==null&&Number(chosen)===j)label.classList.add('wrong');
    });
  });
  form.querySelectorAll('input').forEach(input=>input.disabled=true);
  form.querySelector('button[type=submit]')?.remove();
}

function showPage(page,fn){
  return function(...args){
    const result=fn.apply(this,args);
    document.body.dataset.page=page;
    const nav={home:'#homeNav',lesson:'#homeNav',exam:'#examNav',sources:'#sourcesNav'}[page];
    document.querySelectorAll('.tabs .nav').forEach(b=>b.classList.toggle('active',b.matches(nav)));
    window.scrollTo(0,0);
    return result;
  };
}
home=showPage('home',home);
renderHome=showPage('home',renderHome);
openLesson=showPage('lesson',openLesson);
advance=showPage('lesson',advance);
sources=showPage('sources',sources);
examHome=showPage('exam',examHome);
renderExam=showPage('exam',renderExam);
document.querySelector('#homeNav').onclick=home;
document.querySelector('#sourcesNav').onclick=sources;
document.querySelector('#examNav').onclick=examHome;
document.body.dataset.page='home';
