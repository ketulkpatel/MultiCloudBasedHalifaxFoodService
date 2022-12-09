import React ,{useState} from 'react';
import AWS from 'aws-sdk'

const S3_BUCKET ='recipes-bucket';
const REGION ='us-east-1';

//AWS account credentials
AWS.config.update({
    accessKeyId: 'ASIATRFCIAZID4BRN7AL',
    secretAccessKey: 'M4WaXd7x3UUvDgV0gSFOtzw9KkaNDIZwTCUMQ4N8',
    sessionToken: 'FwoGZXIvYXdzENH//////////wEaDPFV6uL8cAQfoQd+cSLAARwZxITeuKXoAjWoQFU7pofZHlnxcXsxSVhKjC2CIr52V0+to0+TONza2NQ5QPxiTXDrzmo9lb0AVXFHltA8+OczQ2BKWKnnzwwjTm3N+5b1aRq+n3uK1lkDhpp11o+iDcQy2jlkMHufXrU6+vq/YzFbDkt808quuc2ouq0Am0UX96h+8XoyljRUGkZc+VlWuqRH5A2OZ+PIlQIkz5QFYHmcLgcjpb1mQCIB4hm/Who4uNvTYpj5L8J+msoDwJ/N+ijq/LKcBjItWp574P+1fqdkYYzZBc3KEfD+j7PAbDNUJeEXO+GZk29bOM38oz38DlN7Rt65'
})

//bucket credentials
const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

//function that would upload the file
const UploadFileToS3 = () => {

    const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const uploadFile = (file) => {

        console.log("inside upload file function")
        //initializing the parameters to add in the putObject method of the bucket.
        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name,
        };

        //putting data to S3 bucket
        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
            })
    }


    return <div>
        <div> Upload Progress is {progress}%</div>
        <input type="file" onChange={handleFileInput}/>
        <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
    </div>
}

export default UploadFileToS3;