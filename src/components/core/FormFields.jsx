import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react"

export const InputField = ({ label, name, value, onChange }) => (
    <FormControl>
        <FormLabel>{label}</FormLabel>
        <Input name={name} value={value || ''} onChange={onChange} />
    </FormControl>
);

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