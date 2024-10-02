import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const Header = ({
  title,
  searchQuery,
  setSearchQuery,
  setShowModal,
  setItem,
  setMode,
  inputbg,
  buttonbg,
  placeholder,
  onCreateNewItem,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: 15,
      justifyContent: "space-between",
    }}
  >
    <h2 style={{ fontSize: 25, fontWeight: "bold", padding: 15 }}>{title}</h2>
    <div>
      <input
        type="text"
        placeholder={placeholder}
        style={{
          marginRight: 10,
          padding: 12,
          width: 400,
          borderRadius: 5,
          background: inputbg,
          border: `1px solid ${inputbg}`,
          fontSize: 16,
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        style={{
          border: `1px solid ${buttonbg}`,
          padding: 12,
          borderRadius: 5,
          background: buttonbg,
          fontWeight: "bold",
          width: 200,
          fontSize: 16,
          whiteSpace: "nowrap",
        }}
        onClick={() => {
          setItem({
            id: "",
            itemId: "",
            itemCategory: "",
            itemStatus: "",
          });
          setMode("create");
          setShowModal(true);
          onCreateNewItem();
        }}
      >
        <FontAwesomeIcon icon={faCirclePlus} color="orange" />
        &nbsp; Create New {title}
      </button>
    </div>
  </div>
);

export default Header;
