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
  
    let time = 'ยังไม่มีการใช้';

    console.log(milliseconds,totalHours)

      if (totalHours > 0) {
        if(minutes === 0 && seconds === 0){
          time = `${status} ${totalHours} ชั่วโมง`;
        }
        else if(seconds === 0){
          time = `${status} ${totalHours} ชั่วโมง ${minutes} นาที`;
        }
        else{
          time = `${status} ${totalHours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
        }
      } else if (minutes > 0) {
        if(seconds === 0){
          time = `${status} ${minutes} นาที`;
        }
        else{
          time = `${status} ${minutes} นาที ${seconds} วินาที`;
        }
      } else if (seconds > 0) {
        time = `${status} ${seconds} วินาที`;
      }
    return time;
  }