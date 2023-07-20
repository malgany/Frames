const FIRST_LIGHT = "light-1";
const SECOND_LIGHT = "light-2";
const THIRD_LIGHT = "light-3";

let frameCounter = 0;
let intervalId = null;
let running = false;
let promises = [];
let step = 0;

$(window).on('load', showModal);

function showModal() {
    $('#modal').modal('show');
}

function hideModal() {
    $('#modal').modal('hide');
}

function nextStep() {
    $(".pagination .active").removeClass("active");
    $(".pagination .page-item:eq("+step+")").addClass("active");
    if(step > 0) {
        $(".pagination a.page-link:eq(" + (step - 1) + ")").html("✅</br>" + frameCounter + "/f");
    }
    step++;
}

async function start() {
    hideModal()

    nextStep();

    if(step > 10) {

        return;
    }

    running = true;

    promises[promises.length] = await sleep(1000);
    changeLightColor(FIRST_LIGHT, "🟡");
    promises[promises.length] = await sleep(1000);
    changeLightColor(SECOND_LIGHT, "🟡");

    let a = 1//generateRandomNumber();
    promises[promises.length] = await sleep(a);

    movement();
}

function movement() {
    if (!running) return
    startTimeFrames()
    changeLightColor(THIRD_LIGHT, "🟢");

}

function startTimeFrames() {
    frameCounter = 0;
    intervalId = setInterval(() => {
        frameCounter++;
        //console.log(frameCounter);
    }, 1000/60);
}

function stopTimeFrames() {
    if(intervalId != null) {
        clearInterval(intervalId);
        intervalId = null;
        console.log("Frames stopped at: " + frameCounter);
        next();
    } else {
        console.log("No frame interval is currently running.");
        reset();
    }
}

function sleep(milliseconds) {
    if (!running) return
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function generateRandomNumber() {
    return Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
}

function changeLightColor(light, color) {
    if (!running) return
    document.getElementById(light).textContent = color;
}

function resetPromisesAndLights() {
    Promise.all(promises)
        .then(values => console.log(values))
        .catch(error => console.log(`Error in executing promises: ${error}`));
    promises = [];

    [FIRST_LIGHT, SECOND_LIGHT, THIRD_LIGHT].forEach( light => {
        document.getElementById(light).textContent = "⚪";
    });
    $(".pagination .active").removeClass("active");

    intervalId = null;
}

function reset() {
    resetPromisesAndLights();
    $(".pagination a.page-link").html("⬜</br>&nbsp;");
    step = 0;
    showModal();
}

function next() {
    resetPromisesAndLights();
    start();
}
document.body.addEventListener("keydown", function(event) {
    if(event.keyCode === 32){
        running = false;
        console.log("You pressed the space key!");

        if(step > 10) {
            console.log('end')
            return;
        }

        stopTimeFrames();
    }
});