import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function ActionButtons({ onEdit, onDelete }) {
  return (
    <>
    <button onClick={onEdit} style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '5px'}}>
        <FontAwesomeIcon icon={faEdit} color="orange"/>
    </button>

    <button onClick={onDelete} style={{ color: 'white', border: 'none', borderRadius: '5px', padding: '5px'}}>
        <FontAwesomeIcon icon={faTrash} color="orange"/>
    </button>
    </>
  )
}
