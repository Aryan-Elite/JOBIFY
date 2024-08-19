<<<<<<< HEAD
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import Typography from '@mui/material/Typography';
import './New.css'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';


const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard() {
  return (
    <div>
    <div className='mainn'>
        <div className="crd">
    <Card  sx={{ minWidth: 275 }} >
      <CardContent>
        <Typography sx={{ fontSize: 35 }} color="text.primary" gutterBottom>
         <p className='seek'> Jobs Listed</p>
        </Typography>
        <hr/>
        <Typography  variant="body2">
            <div className='fir'>
        <span className='head1'>Job Title</span>: Software Development Engineer (SDE) Intern<br/>
        <span className='head1'>Location</span>: [Company Location]<br/>
        <span className='head1'>Department</span>: Engineering/Technology<br/>
        <span className='head1'>Duration</span>: [Duration of Internship] (e.g., 3 months, 6 months)<br/>
        <span className='head1'>About the role</span>: We are seeking enthusiastic and talented individuals to join our team as Software Development Engineer (SDE) Interns. This internship offers hands-on experience in software development, allowing you to work on real-world projects that impact our products and services. You’ll collaborate with experienced engineers, contributing to the design, development, and testing of software solutions....
        </div>
          <br />
        </Typography>
      </CardContent>
      <CardActions>
       <img className="imagee" src='/cinegame.png'></img>
      </CardActions>
    </Card>
    <Card  sx={{ minWidth: 275 }} >
      <CardContent>
        <Typography sx={{ fontSize: 35 }} color="text.primary" gutterBottom>
         <p className='seek'> Jobs Listed</p>
        </Typography>
        <hr/>
        <Typography  variant="body2">
            <div className='fir'>
        <span className='head1'>Job Title</span>: Software Development Engineer (SDE) Intern<br/>
        <span className='head1'>Location</span>: [Company Location]<br/>
        <span className='head1'>Department</span>: Engineering/Technology<br/>
        <span className='head1'>Duration</span>: [Duration of Internship] (e.g., 3 months, 6 months)<br/>
        <span className='head1'>About the role</span>: We are seeking enthusiastic and talented individuals to join our team as Software Development Engineer (SDE) Interns. This internship offers hands-on experience in software development, allowing you to work on real-world projects that impact our products and services. You’ll collaborate with experienced engineers, contributing to the design, development, and testing of software solutions....
        </div>
          <br />
        </Typography>
      </CardContent>
      <CardActions>
       <img className="imagee" src='/cinegame.png'></img>
      </CardActions>
    </Card>
    </div>
    
    <div className='boxx'>
        <div className='sec'>
    <Card >
    <div className='color'>
    <CardContent>
      <Typography sx={{ fontSize: 35 }} color="text.primary" gutterBottom>
        <span className='categ'>Categories</span>
        <hr className='line'/>
      </Typography>
      <Stack spacing={2} direction="row">
        <p className='bot'>
        <Button variant="contained" sx={{backgroundColor:"rgba(255, 236, 182, 1)",color:"#000"}}>Graphic Design</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>App dev</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>Frontend</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>Backend</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>Ui/Ux</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>Machine Learning</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>Ai</Button>
      <Button variant="contained" sx={{backgroundColor:"rgba(255, 236, 182, 1)",color:"#000"}}>SDE</Button>
      </p>
   </Stack>
    </CardContent>
    </div>
<Stack className="sy" spacing={5} direction="row">
    <Button variant="outlined" sx={{color:'#000',borderColor:'#000',width:" 314px",height: '127px'}}><AddIcon/><h6 className='he'>Add a Job</h6></Button>
    
        </Stack>
  </Card>
  </div>
  <p className='text'>Companies you might be interested in</p>
 <div className='flex'> <img src="/Microsoft.png"></img>
 <p>Microsoft</p>
 </div>
 <div className='flex'> <img src="/Tesla.png"></img>
 <p>Tesla</p>
 </div>
 <div className='flex'> <img src="/Adobe.png"></img>
 <p>Adobe</p>
 </div>
 <div className='flex'> <img src="/FreeState.png"></img>
 <p>FreeState</p>
 </div>
 <div className='download'> <img src="/download.png"></img>
 <p>Geek for Geek</p>
 </div>
   
  </div>
  
  </div>
<div className='stack'>
<Stack className="syx" spacing={5} direction="row">
    <Button variant="outlined" sx={{color:'#000',borderColor:'#000',width:" 40vw",height: '20vh'}}><AddIcon/><h6 className='he'>Add a Job</h6></Button>
    
        </Stack>
        <Stack className="syx" spacing={5} direction="row">
    <Button variant="outlined" sx={{color:'#000',borderColor:'#000',width:" 40vw",height: '20vh'}}><AddIcon/><h6 className='he'>Add a Job</h6></Button>
    
        </Stack>
</div>
  </div>
  
  );
}
=======
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import Typography from '@mui/material/Typography';
import './New.css'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';


const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard() {
  return (
    <div>
    <div className='mainn'>
        <div className="crd">
    <Card  sx={{ minWidth: 275 }} >
      <CardContent>
        <Typography sx={{ fontSize: 35 }} color="text.primary" gutterBottom>
         <p className='seek'> Jobs Listed</p>
        </Typography>
        <hr/>
        <Typography  variant="body2">
            <div className='fir'>
        <span className='head1'>Job Title</span>: Software Development Engineer (SDE) Intern<br/>
        <span className='head1'>Location</span>: [Company Location]<br/>
        <span className='head1'>Department</span>: Engineering/Technology<br/>
        <span className='head1'>Duration</span>: [Duration of Internship] (e.g., 3 months, 6 months)<br/>
        <span className='head1'>About the role</span>: We are seeking enthusiastic and talented individuals to join our team as Software Development Engineer (SDE) Interns. This internship offers hands-on experience in software development, allowing you to work on real-world projects that impact our products and services. You’ll collaborate with experienced engineers, contributing to the design, development, and testing of software solutions....
        </div>
          <br />
        </Typography>
      </CardContent>
      <CardActions>
       <img className="imagee" src='/cinegame.png'></img>
      </CardActions>
    </Card>
    <Card  sx={{ minWidth: 275 }} >
      <CardContent>
        <Typography sx={{ fontSize: 35 }} color="text.primary" gutterBottom>
         <p className='seek'> Jobs Listed</p>
        </Typography>
        <hr/>
        <Typography  variant="body2">
            <div className='fir'>
        <span className='head1'>Job Title</span>: Software Development Engineer (SDE) Intern<br/>
        <span className='head1'>Location</span>: [Company Location]<br/>
        <span className='head1'>Department</span>: Engineering/Technology<br/>
        <span className='head1'>Duration</span>: [Duration of Internship] (e.g., 3 months, 6 months)<br/>
        <span className='head1'>About the role</span>: We are seeking enthusiastic and talented individuals to join our team as Software Development Engineer (SDE) Interns. This internship offers hands-on experience in software development, allowing you to work on real-world projects that impact our products and services. You’ll collaborate with experienced engineers, contributing to the design, development, and testing of software solutions....
        </div>
          <br />
        </Typography>
      </CardContent>
      <CardActions>
       <img className="imagee" src='/cinegame.png'></img>
      </CardActions>
    </Card>
    </div>
    
    <div className='boxx'>
        <div className='sec'>
    <Card >
    <div className='color'>
    <CardContent>
      <Typography sx={{ fontSize: 35 }} color="text.primary" gutterBottom>
        <span className='categ'>Categories</span>
        <hr className='line'/>
      </Typography>
      <Stack spacing={2} direction="row">
        <p className='bot'>
        <Button variant="contained" sx={{backgroundColor:"rgba(255, 236, 182, 1)",color:"#000"}}>Graphic Design</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>App dev</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>Frontend</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>Backend</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>Ui/Ux</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>Machine Learning</Button>
      <Button variant="outlined" sx={{color:'#000',borderColor:'#000'}}>Ai</Button>
      <Button variant="contained" sx={{backgroundColor:"rgba(255, 236, 182, 1)",color:"#000"}}>SDE</Button>
      </p>
   </Stack>
    </CardContent>
    </div>
<Stack className="sy" spacing={5} direction="row">
    <Button variant="outlined" sx={{color:'#000',borderColor:'#000',width:" 314px",height: '127px'}}><AddIcon/><h6 className='he'>Add a Job</h6></Button>
    
        </Stack>
  </Card>
  </div>
  <p className='text'>Companies you might be interested in</p>
 <div className='flex'> <img src="/Microsoft.png"></img>
 <p>Microsoft</p>
 </div>
 <div className='flex'> <img src="/Tesla.png"></img>
 <p>Tesla</p>
 </div>
 <div className='flex'> <img src="/Adobe.png"></img>
 <p>Adobe</p>
 </div>
 <div className='flex'> <img src="/FreeState.png"></img>
 <p>FreeState</p>
 </div>
 <div className='download'> <img src="/download.png"></img>
 <p>Geek for Geek</p>
 </div>
   
  </div>
  
  </div>
<div className='stack'>
<Stack className="syx" spacing={5} direction="row">
    <Button variant="outlined" sx={{color:'#000',borderColor:'#000',width:" 40vw",height: '20vh'}}><AddIcon/><h6 className='he'>Add a Job</h6></Button>
    
        </Stack>
        <Stack className="syx" spacing={5} direction="row">
    <Button variant="outlined" sx={{color:'#000',borderColor:'#000',width:" 40vw",height: '20vh'}}><AddIcon/><h6 className='he'>Add a Job</h6></Button>
    
        </Stack>
</div>
  </div>
  
  );
}
>>>>>>> origin/main
