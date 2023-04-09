export default function formatTime (milliseconds:number) {
    var status = ""
    if(milliseconds < 0){
      var milliseconds:number = Number(String(milliseconds).replace("-", ""));
      status = "Overtime"
    }
    const totalSeconds = Math.floor(milliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    // const days = Math.floor(totalHours / 24);
  
    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = totalHours % 24;
  
    let time = 'Not use';

    console.log(milliseconds,totalHours)

      if (totalHours > 0) {
        if(minutes === 0 && seconds === 0){
          time = `${status} ${totalHours} Hours`;
        }
        else if(seconds === 0){
          time = `${status} ${totalHours} Hours ${minutes} Minutes`;
        }
        else{
          time = `${status} ${totalHours} Hours ${minutes} Minutes ${seconds} Seconds`;
        }
      } else if (minutes > 0) {
        if(seconds === 0){
          time = `${status} ${minutes} Minutes`;
        }
        else{
          time = `${status} ${minutes} Minutes ${seconds} Seconds`;
        }
      } else if (seconds > 0) {
        time = `${status} ${seconds} Seconds`;
      }
    return time;
  }