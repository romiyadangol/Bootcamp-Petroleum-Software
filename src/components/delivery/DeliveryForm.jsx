  import { useState } from 'react';
import { InputField, SelectField } from "../core/FormFields";
import ModalWrapper from "../core/ModalWrapper";

export default function DeliveryForm({ order, onChange, onSave, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customers = [
    { id: "1", name: "customer 1" },
    { id: "2", name: "customer 2" },
    { id: "3", name: "customer 3" },
  ];

  const statuses = ["pending", "delivered", "cancelled"];

  const handleNextStep = () => {
    if (step === 1 && selectedCustomer) {
      setStep(2);
      onChange({ target: { name: "orderGroupInfo.customerId", value: selectedCustomer.id } });
    } else {
      onSave();
    }
  };

  return (
    <ModalWrapper isOpen={true} onClose={onClose} title="Delivery Details" onSave={handleNextStep}>
      {step === 1 ? (
        <SelectField
          label="Select Customer"
          name="customer"
          value={selectedCustomer ? selectedCustomer.name : ""}
          onChange={(e) => {
            const customer = customers.find((cust) => cust.name === e.target.value);
            setSelectedCustomer(customer);
            onChange({ target: { name: "orderGroupInfo.customerId", value: customer.id } });
          }}
          options={customers.map((cust) => cust.name)}
        />
      ) : (
        <>
          <InputField
            label="Order ID"
            name="id"
            value={order.id || ""}  
            onChange={onChange}
          />
          <InputField
            label="Organization ID"
            name="organizationId"
            value={order.organizationId || ""}
            onChange={onChange}
          />
          <InputField
            label="Started At"
            name="startedAt"
            type="datetime-local"
            value={order.startedAt || ""}
            onChange={onChange}
          />
          <InputField
            label="Completed At"
            name="completedAt"
            type="datetime-local"
            value={order.completedAt || ""}
            onChange={onChange}
          />
          <InputField
            label="Planned At"
            name="plannedAt"
            type="datetime-local"
            value={order.plannedAt || ""}
            onChange={onChange}
          />
          <SelectField
            label="Delivery Status"
            name="status"
            value={order.status || ""}
            onChange={onChange}
            options={statuses}
          />
          <InputField
            label="Customer Branch ID"
            name="customerBranchId"
            value={order.customerBranchId || ""}
            onChange={onChange}
          />
          <InputField
            label="Asset ID"
            name="assetId"
            value={order.assetId || ""}
            onChange={onChange}
          />
          {order.lineItems?.map((item, index) => (
            <div key={index}>
              <InputField
                label={`Line Item ${index + 1} Name`}
                name={`deliveryOrder.lineItems[${index}].name`}
                value={item.name || ""}
                onChange={onChange}
              />
              <InputField
                label={`Line Item ${index + 1} Quantity`}
                name={`deliveryOrder.lineItems[${index}].quantity`}
                value={item.quantity || ""}
                onChange={onChange}
              />
              <InputField
                label={`Line Item ${index + 1} Units`}
                name={`deliveryOrder.lineItems[${index}].units`}
                value={item.units || ""}
                onChange={onChange}
              />
            </div>
          ))}
        </>
      )}
    </ModalWrapper>
  );
}
