'use client'
import React, { useState } from "react";
import Stepper, { Step } from "../../components/Stepper";

const Page = () => {
  const [name, setName] = useState<string>("");

  return (
    <div className="min-h-screen">
      <Stepper
        initialStep={1}
        onStepChange={(step) => {
          console.log(step);
        }}
        onFinalStepCompleted={() => console.log("All steps completed!")}
        backButtonText="Previous"
        nextButtonText="Next"
      >
        <Step>
          <h2 className="text-2xl py-3 font-bold">Step 1 : Sign up</h2>
         
          <p>Create your account and verify your email with the verification code and Sign up</p>
        </Step>
        <Step>
         <h2 className="text-2xl py-3 font-bold">Step 2 : Share Your Link</h2>
         
          <p> Copy your unique message link from the dashboard and share it with friends. </p>
        </Step>
        <Step>
          <h2 className="text-2xl py-3 font-bold">Step 3: Receive Messages</h2>
          
          <p> Get anonymous messages in your dashboard and respond if you want. </p>
        </Step>
        
      </Stepper>
    </div>
  );
};

export default Page;
