const StatusCellRenderer = (params) => {
  let statusColor;
  switch (params.value) {
    case "available":
      statusColor = "green";
      break;
    case "out_of_stock":
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
  const dotStyle = {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "8px",
    backgroundColor: statusColor,
  };
  return (
    <span>
      <span style={dotStyle}></span>
      <span>{params.value}</span>
    </span>
  );
};
export default StatusCellRenderer;
