import React from 'react';
import logo from './logo.svg';
import {makeStyles} from '@material-ui/core/styles'
import { Button , Box, TextField} from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Terminal from 'terminal-in-react'
import adb from './webadb'
import './App.css';


let adbClient = null;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 10,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  textField: {
    margin: 10,
    minWidth: 400,
  },
  commandButton:{
    marginTop: 19,
  },
}));

function App() {

  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

  async function executeCommand(cmd,print){
    try {
      console.log(cmd);
   let shell = await adbClient.shell(cmd);
   let r = await shell.receive();
   let decoder = new TextDecoder();
   while (r.cmd == "WRTE") {
     if (r.data != null) {
       print(decoder.decode(r.data));
     }
   //  shell.send("OKAY");
     r = await shell.receive();
   }
  }
  catch (e) {
      print('No devices connected, did you try pressing the connect button?');
  }
  }

  async function connectClick(e){
    let webusb = await adb().open("WebUSB");
     adbClient = await webusb.connectAdb("host::");
  }

  const classes = useStyles();
   return ( <div className={classes.root}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Button className={classes.commandButton} variant="contained" color="primary" onClick={ e => connectClick(e) }>
 Connect
</Button></Paper>
      </Grid>
      <Grid item xs={11}>
      <Terminal
          color='green'
          backgroundColor='black'
          barColor='black'
          style={{ fontWeight: "bold", fontSize: "1em" }}
          commandPassThrough={(cmd, print) => {
            // do something async
            executeCommand(cmd.join(' '),print);
          }}
          commands={{
            'open-google': () => window.open('https://www.google.com/', '_blank'),
            popup: () => alert('Terminal in React')
          }}
          descriptions={{
            'open-google': 'opens google.com',
            showmsg: 'shows a message',
            alert: 'alert', popup: 'alert'
          }}
          msg='You are in an adb shell in your browser. Enjoy!'
        />
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}><Button variant="contained" color="primary">Shutdown</Button></Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}><Button variant="contained" color="primary">Reboot</Button></Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}><Button variant="contained" color="primary">Recovery</Button></Paper>
      </Grid>
    </Grid>
  </div>);

}

export default App;
