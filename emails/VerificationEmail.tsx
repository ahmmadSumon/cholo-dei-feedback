import { Html,Head, Font, Preview, Heading, Row, Section,  Button } from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang='en' dir='ltr'>
            <Head>
                <title>Verification Code</title>
                
            </Head>
            <Preview>Your verification code : {otp}</Preview>
            <Section >

                <Row >
                    <text >Hello {username},</text>    
                    
                </Row>
                 <Row >
                    <text >Thank you for registering. please use the following verification code to complete your registration </text>    
                    
                </Row>
                <Row >
                    <text > {otp},</text>    
                    
                </Row>
                <Row >
                    <text > If you did not request this code , please ignore this email</text>    
                    
                </Row>
            </Section>
        </Html>
    )
}       
