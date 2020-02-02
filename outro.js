// For every star we want to display
for (let j = 0; j < numStars; j++) {
    let star = document.createElement("div");
    star.className = "star";
    var xy = getRandomPosition();
    star.style.top = xy[0] + 'px';
    star.style.left = xy[1] + 'px';
    document.body.append(star);
}

function outroSound() {
    document.getElementById("outroSound").play();
}

function displayOutro() {
    //document.getElementById("mainSound").stop();
    document.getElementsByClassName("step_invitation").item(0).style.display="none";
    document.getElementsByClassName("step_intro").item(0).style.display="none";
    document.getElementsByClassName("step_running").item(0).style.display="none";
    document.getElementsByClassName("step_outro").item(0).style.display="block";
    document.getElementsByClassName("step_outro").item(0).click();
}
