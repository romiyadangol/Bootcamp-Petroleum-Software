import { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, addDays, subDays } from "date-fns";

export default function DatePicker({ selected, onChange, refetch }) {
  const [dateRange, setDateRange] = useState({
    startDate: selected?.startDate || new Date(),
  });

  const handleDateChange = (newDate) => {
    const newRange = { startDate: newDate };
    setDateRange(newRange);
    onChange(newRange);
    refetch();
  };

  const handlePrevious = () => {
    const newStartDate = subDays(dateRange.startDate, 1);
    handleDateChange(newStartDate);
    refetch();
  };

  const handleNext = () => {
    const newStartDate = addDays(dateRange.startDate, 1);
    handleDateChange(newStartDate);
    refetch();
  };

  const datePickerBg = useColorModeValue("#EDF2F7", "#121212");
  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Box
      border="none"
      borderColor="gray.600"
      borderRadius="md"
      p={1.5}
      maxWidth="200px"
      textAlign="center"
      backgroundColor={datePickerBg}
      color={textColor}
      mr={2.5}
    >
      <Flex justify="space-between" align="center">
        <IconButton
          aria-label="Previous"
          icon={<FontAwesomeIcon icon={faChevronLeft} />}
          onClick={handlePrevious}
          size="sm"
          variant="ghost"
          color="gray.500"
        />
        <Text>{format(dateRange.startDate, "MMM dd, yyyy")}</Text>
        <IconButton
          aria-label="Next"
          icon={<FontAwesomeIcon icon={faChevronRight} />}
          onClick={handleNext}
          size="sm"
          variant="ghost"
          color="gray.500"
        />
      </Flex>
    </Box>
  );
}
