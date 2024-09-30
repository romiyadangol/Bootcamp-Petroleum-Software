import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const Header = ({
  searchQuery,
  setSearchQuery,
  setShowModal,
  setAsset,
  setMode,
  inputbg,
  buttonbg,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: 15,
      justifyContent: "space-between",
    }}
  >
    <h2 style={{ fontSize: 25, fontWeight: "bold", padding: 15 }}>
      Asset List
    </h2>
    <div>
      <input
        type="text"
        placeholder="Search..."
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
        }}
        onClick={() => {
          setAsset({
            id: "",
            assetId: "",
            assetCategory: "",
            assetStatus: "",
          });
          setMode("create");
          setShowModal(true);
        }}
      >
        <FontAwesomeIcon icon={faCirclePlus} color="orange" />
        &nbsp; Create New Asset
      </button>
    </div>
  </div>
);

export default Header;
