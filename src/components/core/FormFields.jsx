import {
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";

export const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  isInvalid,
  errorMessage,
}) => {
  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      <Input type={type} name={name} value={value || ""} onChange={onChange} />
      {isInvalid && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
};

export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  width,
  isDisabled,
  isInvalid,
  errorMessage,
}) => (
  <FormControl mb={4} isInvalid={isInvalid}>
    {label && <FormLabel>{label}:</FormLabel>}
    <Select
      name={name}
      value={value || ""}
      onChange={onChange}
      style={{ width }}
      disabled={isDisabled}
    >
      {label && <option value="">Select {label}</option>}
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </Select>
    {isInvalid && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
  </FormControl>
);
