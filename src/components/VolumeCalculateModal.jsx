import { Box, Modal } from '@mui/material';
import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import Select from "react-select";
export default function VolumeCalculateModal({ handleclose, modalopen,totalVolume,setTotalVolume,handleAdd }) {
  const [rectangular, setRectangular] = useState(true);
  const [circle, setCircle] = useState(false);
  const [triangle, setTriangle] = useState(false);
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [diameter, setDiameter] = useState('');
  const [base, setBase] = useState('');
  const [height, setHeight] = useState('');


  const handlerectangular = () => {
    setRectangular(true);
    setTriangle(false);
    setCircle(false);
    setTotalVolume("")
    setHeight("")
    setBase("")
    setDiameter("")
    setDepth("")
    setWidth("")
    setLength("")
  };

  const handlecircle = () => {
    setRectangular(false);
    setTriangle(false);
    setCircle(true);
    setTotalVolume("")
    setHeight("")
    setBase("")
    setDiameter("")
    setDepth("")
    setWidth("")
    setLength("")
  };

  const handletriangle = () => {
    setRectangular(false);
    setTriangle(true);
    setCircle(false);
    setTotalVolume("")
    setHeight("")
    setBase("")
    setDiameter("")
    setDepth("")
    setWidth("")
    setLength("")
  };

  const calculateVolume = () => {
    if (rectangular) {
      const volume = length * width * depth * 7.48;
      setTotalVolume(volume.toFixed(2));
    } else if (circle) {
      const radius = diameter / 2;
      const volume = Math.PI * Math.pow(radius, 2) * depth * 7.48;
      setTotalVolume(volume.toFixed(2));
    } else if (triangle) {
      const volume = 0.5 * base * height * depth * 7.48;
      setTotalVolume(volume.toFixed(2));
    }

  };
  const add = () => {
    if (rectangular) {
      const volume = length * width * depth * 7.48;
      setTotalVolume(volume.toFixed(2));
    } else if (circle) {
      const radius = diameter / 2;
      const volume = Math.PI * Math.pow(radius, 2) * depth * 7.48;
      setTotalVolume(volume.toFixed(2));
    } else if (triangle) {
      const volume = 0.5 * base * height * depth * 7.48;
      setTotalVolume(volume.toFixed(2));
    }
    handleclose()
  };


  return (
    <>
      <Modal open={modalopen} onClose={handleclose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: "33rem",
            bgcolor: 'background.paper',
            outline: "none",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <div className='flex w-[100%] justify-center flex-col relative'>
          <IoMdClose onClick={handleclose} className='absolute top-[-20px] right-[-10px] text-[25px]'/>
            <div className='flex justify-start items-center w-[90%]'>
              <p className='font-[500] text-[20px]'>Pick your pool shape</p>
            </div>
            <div className='flex justify-between items-center mt-5 w-[100%]'>
              <button onClick={handlerectangular} className='flex justify-center items-center w-[130px] h-[40px] rounded-3xl' style={{ background: rectangular ? "#D9E1EB" : "#0B6E99", color: rectangular ? "#969DAA" : "#ffffff" }}>Rectangle</button>
              <button onClick={handlecircle} className='flex justify-center items-center w-[130px] h-[40px] rounded-3xl' style={{ background: circle ? "#D9E1EB" : "#0B6E99", color: circle ? "#969DAA" : "#ffffff" }}>Circle</button>
              <button onClick={handletriangle} className='flex justify-center items-center w-[130px] h-[40px] rounded-3xl' style={{ background: triangle ? "#D9E1EB" : "#0B6E99", color: triangle ? "#969DAA" : "#ffffff" }}>Triangle</button>
            </div>
            {rectangular && (
              <div className='flex justify-between items-center mt-5 w-[100%]'>
                <div className='flex justify-between items-center mt-5 w-[90%]'>
                  <div className='flex justify-start flex-col'>
                    <div className='flex justify-start flex-col'>
                      <label>Length:</label>
                      <input
                        type='text'
                        placeholder='length in feet'
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className='w-[200px] h-[30px] pl-2 pr-2 rounded-md mt-2 outline-none border'
                      />
                    </div>
                    <div className='flex justify-start flex-col mt-3'>
                      <label>Width:</label>
                      <input
                        type='text'
                        placeholder='width in feet'
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className='w-[200px] h-[30px] pl-2 pr-2 rounded-md mt-2 outline-none border'
                      />
                    </div>
                    <div className='flex justify-start flex-col mt-3'>
                      <label>Depth:</label>
                      <input
                        type='text'
                        placeholder='depth in feet'
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        className='w-[200px] h-[30px] pl-2 pr-2 rounded-md mt-2 outline-none border'
                      />
                    </div>
                  </div>
                  <div className='flex ml-5 justify-start flex-col'>
                    <label>Total Volume of water (in gallons)</label>
                    <input
                      type='text'
                      value={totalVolume}
                      readOnly
                      className='w-[200px] h-[30px] rounded-md mt-2 outline-none border'
                    />
                  </div>
                </div>
              </div>
            )}
            {circle && (
              <div className='flex justify-between items-center mt-5 w-[100%]'>
                <div className='flex justify-between items-center mt-5 w-[90%]'>
                  <div className='flex justify-start flex-col'>
                    <div className='flex justify-start flex-col mt-3'>
                      <label>Diameter:</label>
                      <input
                        type='text'
                        placeholder='diameter in feet'
                        value={diameter}
                        onChange={(e) => setDiameter(e.target.value)}
                        className='w-[200px] h-[30px] pl-2 pr-2 rounded-md mt-2 outline-none border'
                      />
                    </div>
                    <div className='flex justify-start flex-col mt-3'>
                      <label>Depth:</label>
                      <input
                        type='text'
                        placeholder='depth in feet'
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        className='w-[200px] h-[30px] pl-2 pr-2 rounded-md mt-2 outline-none border'
                      />
                    </div>
                  </div>
                  <div className='flex  ml-5 justify-start flex-col'>
                    <label>Total Volume of water (in gallons)</label>
                    <input
                      type='text'
                      value={totalVolume}
                      readOnly
                      className='w-[200px] h-[30px] rounded-md mt-2 outline-none border'
                    />
                  </div>
                </div>
              </div>
            )}
            {triangle && (
              <div className='flex justify-between items-center mt-5 w-[100%]'>
                <div className='flex justify-between items-center mt-5 w-[90%]'>
                  <div className='flex justify-start flex-col'>
                    <div className='flex justify-start flex-col'>
                      <label>Base:</label>
                      <input
                        type='text'
                        placeholder='base in feet'
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        className='w-[200px] h-[30px] pl-2 pr-2 rounded-md mt-2 outline-none border'
                      />
                    </div>
                    <div className='flex justify-start flex-col mt-3'>
                      <label>Height:</label>
                      <input
                        type='text'
                        placeholder='height in feet'
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className='w-[200px] h-[30px] pl-2 pr-2 rounded-md mt-2 outline-none border'
                      />
                    </div>
                    <div className='flex justify-start flex-col mt-3'>
                      <label>Depth:</label>
                      <input
                        type='text'
                        placeholder='depth in feet'
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        className='w-[200px] h-[30px] pl-2 pr-2 rounded-md mt-2 outline-none border'
                      />
                    </div>
                  </div>
                  <div className='flex ml-5 justify-start flex-col'>
                    <label>Total Volume of water (in gallons)</label>
                    <input
                      type='text'
                      value={totalVolume}
                      readOnly
                      className='w-[200px] h-[30px] rounded-md mt-2 outline-none border'
                    />
                  </div>
                </div>
              </div>
            )}
            <div className='flex justify-start w-[100%] mt-5'>
              <button onClick={calculateVolume} className='flex justify-center items-center w-[130px] h-[40px] rounded-3xl text-[white] bg-[#0B6E99]'>Calculate</button>
              <button onClick={handleAdd} className='flex justify-center items-center ml-5 w-[130px] h-[40px] rounded-3xl text-[white] bg-[#0B6E99]'>Add</button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
