const SCORE_MAP={compliant:100,partial:50,non_compliant:0};
function calcScore(results){if(!results||!results.length)return{score:0,obtained:0,possible:0,rating:'Poor'};let obtained=0;results.forEach(r=>{obtained+=SCORE_MAP[r.status]??0;});const possible=results.length*100;const score=possible?Math.round((obtained/possible)*100):0;return{score,obtained,possible,rating:ratingOf(score)};}
function ratingOf(score){if(score>=80)return'Good';if(score>=60)return'Needs Improvement';return'Poor';}
module.exports={SCORE_MAP,calcScore,ratingOf};
