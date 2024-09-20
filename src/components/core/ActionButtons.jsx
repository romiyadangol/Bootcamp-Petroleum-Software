import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useColorModeValue } from "@chakra-ui/react";

export default function ActionButtons({ onEdit, onDelete }) {
  const trashIcon = useColorModeValue("#364859", "#F1F3F4");
  return (
    <div style={{ position: "relative", zIndex: "999", display: "flex" }}>
      <button
        onClick={onEdit}
        style={{
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "5px",
          width: "100%",
        }}
      >
        <FontAwesomeIcon
          icon={faEdit}
          color={trashIcon}
          style={{ pointerEvents: "none" }}
        />
      </button>

      <button
        onClick={onDelete}
        style={{
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "5px",
          width: "100%",
        }}
      >
        <FontAwesomeIcon
          icon={faTrash}
          color={trashIcon}
          style={{ pointerEvents: "none" }}
        />
      </button>
    </div>
  );
}
