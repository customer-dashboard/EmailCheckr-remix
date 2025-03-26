import setting_json from './setting.js';
export const CurrentDate = () => {
    let date_time = new Date();
    // get current date
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);
    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    // get current year
    let year = date_time.getFullYear();
    // get current hours
    let hours = date_time.getHours();
    // get current minutes
    let minutes = date_time.getMinutes();
    // get current seconds
    let seconds = date_time.getSeconds();
  
    return (
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  };



                  {/* {
                 setting.translation &&
                  Object.keys(setting.translation)?.map((lang1, key1) => {
                    console.log("key1--", key1);
                    console.log("lang1--", lang1);
                    Object.keys(setting.translation[lang1]).map((lang2, key2) => {
                      console.log("key2--", key2);
                      console.log("lang2value--", setting.translation[lang1][lang2]);
                    })
                  })
                  } */}