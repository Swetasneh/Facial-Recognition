import './App.css';
import React, {Component} from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register.js';




// const key='dc756c6926e84832b1787c18551d5797';
// const pat='81240e64be8b490eab1f37a9d5cc476b';
const initialState={
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    joined:''

  }
}
class App extends Component {

  constructor(){
    super();
    this.state=initialState;

    };
  
  loadUser=(data)=>{
    this.setState({user:{
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined
    }});
  }

  calculateFaceLocation=(data)=>{
    const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box;
    const image= document.getElementById('inputimage');
    const width= Number(image.width);
    const height=Number(image.height);
    console.log(width,height);
    return {

      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width-(clarifaiFace.right_col*width),
      bottomRow: height-(clarifaiFace.bottom_row*height)

    }
  }
  displayFaceBox=(box)=>{

    this.setState({box:box});
    
  }
  onInputChange=(event)=>{
  
    this.setState({input:event.target.value});
  }
  onSubmit=()=>{
  
    this.setState({imageUrl:this.state.input});
   

  


// URL of image to use. Change this to your image.


const raw = JSON.stringify({
  "user_app_id": {
    "user_id": "clarifai",
    "app_id": "main"
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": this.state.input,
              }
          }
      }
  ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + '81240e64be8b490eab1f37a9d5cc476b'
    },
    body: raw
};

// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id

fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
   
.then(response => response.json())
.then(result => {
  if (result) {
    fetch('http://localhost:3000/image', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.state.user.id,
      
      })
    })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, { entries: count}));
       
   
      })
      
  }
      this.displayFaceBox(this.calculateFaceLocation(result))
})
    .catch(error => console.log('error', error));
  
  
  }

  onRouteChange=(route)=>{
    if(route==='signout'){
      this.setState(initialState)
    }else if(route==='home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  render() {
    const {isSignedIn,imageUrl,route,box } = this.state;
    return(
    <div className="App">
       
     
     
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      {
      route==='home'

        ?<div>
          <Logo/>
         
         <Rank name={this.state.user.name} entries={this.state.user.entries}/>
      <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/> 
      
      <FaceRecognition box={box}imageUrl={imageUrl }/>
      </div>
      :(
        route==='signin'?
        <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      )
      }
    </div>
  );
}
}


export default App;
