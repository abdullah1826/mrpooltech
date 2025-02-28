import React, { useEffect, useState } from 'react'
// import base64Img from 'base64-img';


const Singleproduct = ({ name, price, img, description, index, allprices, setallpricess, qty, id }) => {

    let total = 0;
    total += price;
    console.log(total)
    // useEffect(() => {
    //     setallpricess([...allprices, price])

    // }, [])
    // let [qty, setqty] = useState(1)



    // const [imageUrl, setImageUrl] = useState(null);

    const [base64Image, setBase64Image] = useState("");

    const getBase64FromUrl = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data);
                console.log(resolve(base64data))
            }
        });
    }

    useEffect(() => {
        // const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
        let toBase64 = async () => {
            const base64 = await fetch(img)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    return new Promise((res) => {
                        reader.onloadend = () => {
                            res(reader.result);
                        }
                    })
                })
            setBase64Image(base64)
            console.log(base64)
        }
        toBase64()
    }, [img]);




    return (
        <div className='w-[100%] flex'>
            <div className='w-[15%] border flex justify-center text-2xl font-[400] min-h-[300px] pt-1'>{index + 1}</div>
            <div className='w-[45%] border min-h-[300px] h-max pl-[25px] pt-[25px]'>
                <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            <div className='w-[40%] border min-h-[300px]'>
                <div className='w-[100%] h-[50px] border flex'>
                    <div className='w-[50%] border h-[50px] flex justify-center items-center text-xl'>{parseInt(parseInt(price) / localStorage.getItem(`${id}`))}</div>
                    {/* <input type="number" className='w-[40%] text-center outline-none' onChange={(e) => setqty(e.target.value)} value={qty} /> */}
                    <div className='w-[50%] border h-[50px] flex justify-center items-center text-xl'>{price}</div>
                </div>
                <div className='w-[100%]'>
                    <img src={base64Image} alt="product" className='  w-[100%] h-[245px]' id="imageid" />
                </div>
            </div>
        </div>
    )
}

export default Singleproduct