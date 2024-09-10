import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useColorModeValue } from "@chakra-ui/react";

export default function ActionButtons({ onEdit, onDelete }) {
  const trashIcon = useColorModeValue('#364859', '#F1F3F4');
  return (
    <>
    <button onClick={onEdit} style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '5px', marginRight:10 }}>
        <FontAwesomeIcon icon={faEdit} color={trashIcon} />
    </button>

    <button onClick={onDelete} style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '5px', marginLeft: 10}}>
        <FontAwesomeIcon icon={faTrash} color={trashIcon}/>
    </button>
    </>
  )
}
