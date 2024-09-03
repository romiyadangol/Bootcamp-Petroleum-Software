import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const EditableCellRenderer = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState(props.value);

  useEffect(() => {
    // Reset cell value if editing is canceled
    setCellValue(props.value);
  }, [props.value]);

  const onEditClick = () => {
    setIsEditing(true);
  };

  const onSave = () => {
    setIsEditing(false);
    props.setValue(cellValue); // Update the grid value with the edited value
  };

  const handleChange = (event) => {
    setCellValue(event.target.value);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '5px' }}
    >
      {isEditing ? (
        <input 
          type="text" 
          value={cellValue} 
          onChange={handleChange} 
          onBlur={onSave} 
          style={{ width: '100%' }}
          autoFocus
        />
      ) : (
        <>
          <span>{cellValue}</span>
          {isHovered && !isEditing && (
            <button 
              onClick={onEditClick}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginLeft: '5px',
                color: 'white',
                position: 'absolute',
                right: '0',
              }}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EditableCellRenderer;
