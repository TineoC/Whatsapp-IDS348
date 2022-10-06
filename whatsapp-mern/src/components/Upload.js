import React, { useState } from 'react'
import UploadServices from 'Upload.Services'

const Upload = (sertImages, images) => {

    const [name, setName] = useState("")
    const [file, setFile] = useState()
    const [pathImage, setPathImage] = useState()

    const sendImage = (e) =>{
        e.preventDefault()
        UploadServices.sendImages(name, file).the((result) =>{
            console.log("El resultado es: ", result)
        })
    }

    const onFileChange = (e) => {
        if(e.target.files && e.target.files.lenght > 0){
            const file = e.target.files[0]
            if(file.type.includes("image")){
                const reader = new FileReader()
                reader.readAsDataURL(file)

                //Esto es para modificar la 
                reader.onload = function load(){
                    setPathImage(reader.result)
                }
                setFile(file)
            }else{
                console.log("There was a error")
            }
        }
    }

    return {

    }
}

export default Upload