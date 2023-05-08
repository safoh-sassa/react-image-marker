import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import Image from 'react-bootstrap/Image';
import RangeSlider from 'react-bootstrap-range-slider';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

function ImageMarker() {
  const [image, setImage] = useState(null);
  const [marks, setMarks] = useState([]);
  const ref = useRef();
  const [imgDimensions, setImgDimensions] = useState({ Width: 0, Height: 0 })
  const [imgLoaded, setImgLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titlePos, setTitlePos] = useState({ X: 0, Y: 0 })

  const updateSize = useCallback(() => {

    if (imgLoaded === true) {
      setImgDimensions({ Width: ref.current.clientWidth, Height: ref.current.clientHeight })

    }
  }, [imgLoaded])

  useLayoutEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
  }, [updateSize]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
      setImgLoaded(true);
    };
    reader.readAsDataURL(file);
  };

  const handleMarkChange = (index, axis, value) => {
    const responsiveValue = axis === 'x' ? value * 100 / imgDimensions.Width : value * 100 / imgDimensions.Height
    setMarks((prev) => {
      const newMarks = [...prev];
      newMarks[index][axis] = responsiveValue;
      return newMarks;
    });
  };

  const handleAddMark = () => {
    setMarks((prev) => [...prev, { x: 0, y: 0 }]);
    updateSize();
  };

  const handleRemoveMark = (index) => {
    setMarks((prev) => {
      const newMarks = [...prev];
      newMarks.splice(index, 1);
      return newMarks;
    });
  }

  const handleAddTitle = (value) => {
    setTitle(value)
    updateSize();
  };

  const inputStyle = { height: "40px", fontSize: "26px" };
  const textaAreaStyle = { height: "220px", fontSize: "26px" };

  const numberCircle = {
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    background: "red",
    border: "2px solid black",
    color: "white",
    textAlign: "center",
    font: "24px Arial, sans-serif",
  }

  return (
    <div style={{ margin: "30px" }}>
      <h2>Image Marker</h2>
      {image && (
        <div>
          <div style={{ width: "99%", display: "flex", height: "20%" }}>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>
                    <Form.Control
                      style={inputStyle}
                      type="text"
                      onChange={(event) => handleAddTitle(event.target.value)}
                      placeholder='Title'
                    />
                    <br />
                    <b style={{ color: "#2FE979", marginRight: "5px", marginLeft: "15px" }}>Y</b>
                    <RangeSlider
                      min={0}
                      max={imgDimensions.Height - 150}
                      onChange={(event) => setTitlePos(
                        {
                          ...titlePos,
                          Y: parseInt(event.target.value * 100 / imgDimensions.Height)
                        })}

                      value={parseInt(((titlePos.Y * imgDimensions.Height) / 100))}
                      style={{ width: "90%" }}
                    />
                    <b style={{ color: "#2FE979", marginRight: "5px", marginLeft: "15px" }}>X</b>
                    <RangeSlider
                      min={0}
                      max={imgDimensions.Width - 340}
                      onChange={(event) => setTitlePos(
                        {
                          ...titlePos,
                          X: parseInt(event.target.value * 100 / imgDimensions.Width)
                        })}

                      value={parseInt(((titlePos.X * imgDimensions.Width) / 100))}
                      style={{ width: "90%" }}
                    />
                  </td>
                  <td>
                    <Form.Control
                      as="textarea"
                      style={textaAreaStyle}
                      type="text"
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder='Description'
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
            <br />
          </div>
          <div style={{ position: "relative" }} >
            <Image ref={ref} src={image} alt="uploaded" className='img-fluid' /> <br />
            {marks.map((mark, index) => (
              <div key={index}
                style={{ top: ((mark.y * imgDimensions.Height) / 100) - 20, left: ((mark.x * imgDimensions.Width) / 100) - 20, position: "absolute" }}
              >
                <div style={numberCircle}>{index + 1}</div>
              </div>
            ))}
            {title &&
              <div style={{
                top: ((titlePos.Y * imgDimensions.Height) / 100),
                left: ((titlePos.X * imgDimensions.Width) / 100), position: "absolute",
                borderColor: "#00857c",
                borderWidth: "1px",
                borderStyle: 'solid',
                minWidth: "350px",
                maxWidth: "350px",
                maxHeight: "150px",
                minHeight: "150px"
              }}>
                <b>{title}</b><br />
                {description}
              </div>
            }
          </div>
          {marks.map((mark, index) => (
            <div id="marksDiv" key={index} style={{ display: "flex", width: "90%", marginTop: "8px" }}>
              {index + 1} -  <b style={{ color: "#2FE979", marginRight: "5px", marginLeft: "15px" }}>Y</b>
              <RangeSlider
                min={1}
                max={imgDimensions.Height - 20}
                onChange={(event) => handleMarkChange(index, 'y', parseInt(event.target.value))}
                value={parseInt(((mark.y * imgDimensions.Height) / 100))}
                style={{ marginRight: "50px", width: "140px" }}
              />
              <b style={{ color: "#2FE979", marginRight: "5px" }}>X</b>
              <RangeSlider
                min={1}
                max={imgDimensions.Width - 20}
                onChange={(event) => handleMarkChange(index, 'x', parseInt(event.target.value))}
                value={parseInt(((mark.x * imgDimensions.Width) / 100))}
                style={{ width: "140px" }}
              />

              <Button
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "30px", height: "25px", marginLeft: "10px" }}
                variant="danger"
                onClick={() => handleRemoveMark(index)}><i className="bi bi-trash"></i></Button>
            </div>
          ))}

          <Button variant="outline-primary" onClick={handleAddMark}
            style={{ marginTop: "8px" }}
          >Add Mark</Button>
        </div>
      )
      }
      <br />
      <input style={{ width: "350px", marginTop: "30px" }} className='form-control' type="file" onChange={handleImageChange} /><br />
      {imgDimensions.Width !== 0 && <b> Image Width:{imgDimensions.Width} <br /> Image Height:{imgDimensions.Height}</b>}
    </div >
  );
}

export default ImageMarker;
