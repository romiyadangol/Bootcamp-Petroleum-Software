import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react"

export const InputField = ({ label,type, name, value, onChange }) => {
    console.log(type);
    return (
    <FormControl>
        <FormLabel>{label}</FormLabel>
        <Input type={type} name={name} value={value || ''} onChange={onChange} />
    </FormControl>
)};

export const SelectField = ({ label, name, value, onChange, options}) => (
    <FormControl mb={4}>
        <FormLabel>{label}:</FormLabel>
        <Select name={name} value={value || ''} onChange={onChange}>
            <option value="">Select {label}</option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </Select>
    </FormControl>
);