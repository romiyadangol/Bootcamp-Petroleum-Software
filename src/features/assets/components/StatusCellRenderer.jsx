const StatusCellRenderer = (params) => {
  const status = params.value === "active" ? "success" : "danger";
  const dotStyle = {
    display: "inline-block",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "8px",
    backgroundColor: status === "success" ? "green" : "red",
  };
  return (
    <span>
      <span style={dotStyle}></span>
      <span className={`badge rounded-pill bg-${status}`}>{params.value}</span>
    </span>
  );
};
export default StatusCellRenderer;
