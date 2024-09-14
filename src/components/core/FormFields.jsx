import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react"

export const InputField = ({ label,type, name, value, onChange }) => {
    return (
    <FormControl>
        <FormLabel>{label}</FormLabel>
        <Input type={type} name={name} value={value || ''} onChange={onChange} />
    </FormControl>
)};

export const SelectField = ({ label, name, value, onChange, options, width}) => (
    <FormControl mb={4}>
        <FormLabel>{label}:</FormLabel>
        <Select name={name} value={value || ''} onChange={onChange} style={{ width }}>
            <option value="">Select {label}</option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </Select>
    </FormControl>
);