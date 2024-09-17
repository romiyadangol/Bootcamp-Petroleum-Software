import React, { useState } from 'react';
import { Box, Flex, IconButton, Text, useColorModeValue } from "@chakra-ui/react";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";

export default function DatePicker({ selected, onChange }) {
  const [dateRange, setDateRange] = useState({
    startDate: selected?.startDate || dayjs(),
  });

  const handlePrevious = () => {
    const newStartDate = dateRange.startDate.subtract(1, 'day');
    const newRange = { startDate: newStartDate };
    setDateRange(newRange);
    onChange(newRange);
  };

  const handleNext = () => {
    const newStartDate = dateRange.startDate.add(1, 'day');
    const newRange = { startDate: newStartDate };
    setDateRange(newRange);
    onChange(newRange);
  };

  const datePickerBg = useColorModeValue('#EDF2F7', '#121212');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <Box
      border="none"
      borderColor="gray.600"
      borderRadius="md"
      py={2}
      px={4}
      maxWidth="300px"
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
        <Text>
          {dateRange.startDate.format('MMM DD, YYYY')}
        </Text>
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
