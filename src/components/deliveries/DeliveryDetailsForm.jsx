import { useEffect, useState } from "react";
import ModalWrapper from "../core/ModalWrapper";
import { useQuery } from "@apollo/client";
import { FIND_PRODUCTS } from "../../graphql/queries/products/findProducts";
import { InputField, SelectField } from "../core/FormFields";
import { VStack } from "@chakra-ui/react";

export default function DeliveryDetailsForm({
  onClose,
  onSave,
  initialLineItem,
}) {
  const [lineItem, setLineItem] = useState({
    id: initialLineItem?.id || "",
    name: initialLineItem?.name || "",
    quantity: initialLineItem?.quantity || 0,
    units: initialLineItem?.units || "",
  });
  const { data: productData } = useQuery(FIND_PRODUCTS);
  const products = productData?.findProducts.products || [];

  useEffect(() => {
    if (initialLineItem) {
      console.log("Setting lineItem state to:", initialLineItem);
      setLineItem(initialLineItem);
    }
  }, [initialLineItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLineItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    console.log("Saving line item:", lineItem);
    onSave(lineItem);
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={true}
      onClose={onClose}
      title="LineItem Details"
      onSave={handleSave}
    >
      <VStack spacing={4}>
        <SelectField
          label="Name"
          name="name"
          value={lineItem.name || "N/A"}
          onChange={handleChange}
          options={products.map((product) => product.name)}
        />
        <InputField
          label="Quantity"
          name="quantity"
          value={lineItem.quantity || 0}
          onChange={handleChange}
          type="number"
        />
        <SelectField
          label="Units"
          name="units"
          value={lineItem.units ? lineItem.units.toLowerCase() : "N/A"}
          onChange={handleChange}
          options={["gallons", "liters"]}
        />
      </VStack>
    </ModalWrapper>
  );
}
