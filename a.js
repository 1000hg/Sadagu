const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const app = express()
const port = 3000

app.get("/nodemailerTest", function(req, res, next){

	console.log("123");
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',  // gmail 계정 아이디를 입력
      pass: ''          // gmail 계정의 비밀번호를 입력
    }
  });

  let mailOptions = {
    from: '',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: '' ,                     // 수신 메일 주소
    subject: 'Sending Email using Node.js',   // 제목
    text: 'That was easy!'  // 내용
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }
    else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.redirect("/");
})


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))