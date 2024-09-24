const statusRender = (params) => {
  let statusColor;
  switch (params.value) {
    case "completed":
      statusColor = "green";
      break;
    case "pending":
      statusColor = "orange";
      break;
    case "cancelled":
      statusColor = "red";
      break;
    case "active":
      statusColor = "green";
      break;
    case "inactive":
      statusColor = "red";
      break;
    default:
      statusColor = "gray";
  }
  return (
    <div
      style={{
        borderRadius: "12px",
        color: "white",
        backgroundColor: statusColor,
        fontWeight: "bold",
        textAlign: "center",
        width: "60%",
        padding: "15px",
        height: "25px",
        marginTop: "5px",
        position: "relative",
        minWidth: "100px",
        maxWidth: "max-content",
      }}
    >
      <span
        style={{
          display: "block",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {params.value}
      </span>
    </div>
  );
};
export default statusRender;
