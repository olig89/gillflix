import { Flex, StatGroup, Stat, CircularProgress, CircularProgressLabel, StatLabel, StatHelpText, useColorModeValue } from '@chakra-ui/react';
import React, { ReactElement } from 'react';


interface Props {
  concept: number;
  cinema: number;
  perform: number;
}

export default function Donut({
  concept,
  cinema,
  perform
}: Props): ReactElement {
  return (
    <Flex
            direction={{ base: 'column', lg: 'row' }}
            justifyContent="space-between"
            width="full"
            mt={'28'}
            textAlign={{ base: 'center', lg: 'left' }}
          >
            <StatGroup
              flexDirection={{ base: 'column', lg: 'row' }}
              alignItems="center"
              justifyContent="space-between"
              width="full"
              textAlign="center"
              mb={10}
            >
              <Stat mb={7}>
                <CircularProgress value={concept} min={0} max={10} color="cyan.400" trackColor={useColorModeValue(`gray.200`, `gray.500`)} size="100px" thickness="16px" mb={3}>
                  <CircularProgressLabel fontWeight="semibold" fontSize="35" mt={[0,0,-0.5,-0.5]}>{concept}</CircularProgressLabel>
                </CircularProgress>
                <StatLabel color={'gray.500'} fontSize="lg">
                  Concept
                </StatLabel>
                <StatHelpText>Premise, plot, and structure</StatHelpText>
              </Stat>
              <Stat mb={7}>
                <CircularProgress value={cinema} min={0} max={10} color="yellow.400" trackColor={useColorModeValue(`gray.200`, `gray.500`)} size="100px" thickness="16px" mb={3}>
                  <CircularProgressLabel fontWeight="semibold" fontSize="35" mt={[0,0,-0.5,-0.5]}>{cinema}</CircularProgressLabel>
                </CircularProgress>
                <StatLabel color={'gray.500'} fontSize="lg">
                  Cinematography
                </StatLabel>
                <StatHelpText>Visuals, sound, direction, and design</StatHelpText>
              </Stat>
              <Stat mb={7}>
                <CircularProgress value={perform} min={0} max={10} color="red.400" trackColor={useColorModeValue(`gray.200`, `gray.500`)} size="100px" thickness="16px" mb={3}>
                  <CircularProgressLabel fontWeight="semibold" fontSize="35" mt={[0,0,-0.5,-0.5]}>{perform}</CircularProgressLabel>
                </CircularProgress>
                <StatLabel color={'gray.500'} fontSize="lg">
                  Performance
                </StatLabel>
                <StatHelpText>Acting, narration, and technique</StatHelpText>
              </Stat>
            </StatGroup>
          </Flex>
  );
}
