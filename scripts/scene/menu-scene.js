import { getCenterX, getCenterY, getHeight, getWidth } from "../utils/utils.js";


export class MenuScene extends Phaser.Scene {

    constructor() {
        super({ key: "MenuScene" });
      }


      create(){
        let bg = this.add.image(getCenterX(this), getCenterY(this), "menu_bg");
        bg.displayHeight = getHeight(this);
        bg.displayWidth = getWidth(this);

        let logo = this.add.image(getCenterX(this), 300, "logo").setScale(0.6);

        this.tweens.add({
            targets: logo,
            scale: 0.62,
            yoyo: true,
            repeat: -1
        })

        let firstNameInput = this.add.dom(getCenterX(this) - 150, 480, 'input', {
            color: '#0ed0fc',
            backgroundColor: '#ffffff',
            width:  '250px',
            height: '70px',
            border: '5px solid #e22dc8',
            borderRadius: '10px',
            paddingLeft: '20px',
            font: '50px font',
            outline: 'none',
            fontFamily: 'font',
            textAlign: "center"
        }).setDepth(10);

        firstNameInput.node.setAttribute('placeholder', 'First Name');

        let lastNameInput = this.add.dom(getCenterX(this) + 150, 480, 'input', {
            color: '#0ed0fc',
            backgroundColor: '#ffffff',
            width:  '250px',
            height: '70px',
            border: '5px solid #e22dc8',
            borderRadius: '10px',
            paddingLeft: '20px',
            font: '50px font',
            outline: 'none',
            fontFamily: 'font',
            textAlign: "center"
        }).setDepth(10);

        lastNameInput.node.setAttribute('placeholder', 'Last Name');


        let emailInput = this.add.dom(getCenterX(this), 580, 'input', {
            color: '#0ed0fc',
            backgroundColor: '#ffffff',
            width:  '550px',
            height: '70px',
            border: '5px solid #e22dc8',
            borderRadius: '10px',
            paddingLeft: '20px',
            font: '50px font',
            outline: 'none',
            fontFamily: 'font',
            textAlign: "center"
        }).setDepth(10);

        emailInput.node.setAttribute('placeholder', 'Email Address');


        let phoneNumberInput = this.add.dom(getCenterX(this), 680, 'input', {
            color: '#0ed0fc',
            backgroundColor: '#ffffff',
            width:  '550px',
            height: '70px',
            border: '5px solid #e22dc8',
            borderRadius: '10px',
            paddingLeft: '20px',
            font: '50px font',
            outline: 'none',
            fontFamily: 'font',
            textAlign: "center"
        }).setDepth(10);

        phoneNumberInput.node.setAttribute('placeholder', 'Phone Number');

        let vehicleInput = this.add.dom(getCenterX(this), 780, 'input', {
            color: '#0ed0fc',
            backgroundColor: '#ffffff',
            width:  '550px',
            height: '70px',
            border: '5px solid #e22dc8',
            borderRadius: '10px',
            paddingLeft: '20px',
            font: '50px font',
            outline: 'none',
            fontFamily: 'font',
            textAlign: "center"
        }).setDepth(10);

        vehicleInput.node.setAttribute('placeholder', 'Vehicle Owned');

        let playBtn = this.add.image(getCenterX(this), 940, "play").setScale(0.5).setInteractive({cursor: "pointer"})
        .on("pointerup", ()=>{
            let firstName = firstNameInput.node.value.trim();
            let lastName = lastNameInput.node.value.trim();
            let email = emailInput.node.value.trim();
            let phoneNumber = phoneNumberInput.node.value.trim();
            let vehicle = vehicleInput.node.value.trim();
    
            // ✅ Email Validation (Regex Check)
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let isEmailValid = emailRegex.test(email);
    
            // ✅ Required Field Check
            if (!firstName || !lastName || !email || !phoneNumber || !vehicle) {
                console.log("⚠️ All fields are required!");
                return;
            }
    
            if (!isEmailValid) {
                console.log("⚠️ Please enter a valid email address!");
                return;
            }
    
            this.scene.start("GameScene");

            // ✅ If everything is okay, proceed
            console.log("✅ Form submitted successfully!");
        })

        this.tweens.add({
            targets: playBtn,
            angle: 10,
            duration: 2000,
            yoyo: true,
            repeat: -1
        })


      }
}