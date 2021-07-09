import React, { useState, useEffect, useContext } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
  useColorModeValue,
  Flex,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  useToast,
  useColorMode,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import { useBetween } from 'use-between';

import { useQuery, useQueryClient } from 'react-query';

import { AiFillHeart } from 'react-icons/ai';
import { AiFillBulb } from 'react-icons/ai';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import { FaTheaterMasks } from 'react-icons/fa';

import { getMovies } from '../../utils/queries';
import { MovieType } from '../../models/movie';
import { ReviewEndpointBodyType } from '../../types/APITypes';
import { ReviewModalContext, useMovie } from '../../utils/ModalContext';

export const ReviewModal: React.FC<{ isAdmin: boolean; inNav?: boolean }> = ({
  isAdmin,
  inNav = false,
}): React.ReactElement => {
  const { colorMode } = useColorMode();
  const { movie, setMovie } = useBetween(useMovie);
  const { isOpen, onOpen, onClose } = useContext(ReviewModalContext);
  const [rating, setRating] = useState(0);
  const [cinema, setCinema] = useState(0);
  const [concept, setConcept] = useState(0);
  const [perform, setPerform] = useState(0);
  const [comment, setComment] = useState(``);
  const [commentError, setCommentError] = useState(``);
  const [movieError, setMovieError] = useState(``);
  const [success, setSuccess] = useState(``);

  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries(`movies`).catch(console.error);
      toast({
        variant: `solid`,
        title: success === `addition` ? `Review Added` : `Review Modified`,
        description:
          success === `addition`
            ? `Your review was successfully added to ${movie?.name}`
            : `Your review on ${movie.name} was successfully modified`,
        status: `success`,
        duration: 5000,
        isClosable: true,
      });
      setSuccess(null);
    }
  }, [movie?.name, queryClient, success, toast]);

  const initialRef = React.useRef();
  const { data: movies } = useQuery(`movies`, getMovies);

  const handleSubmit = async (e, onClose) => {
    e.preventDefault();
    if (!movie) {
      return setMovieError(`Please select a valid film.`);
    }

    const data: ReviewEndpointBodyType = {
      // eslint-disable-next-line no-underscore-dangle
      movieID: movie._id,
      comment,
      rating,
      cinema,
      concept,
      perform

    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URI}/api/review`, {
      method: `post`,
      body: JSON.stringify(data),
    });

    const successData = await res.json();

    if (res.status === 200) {
      setSuccess(successData.type);
      setComment(``);
      setMovie(null);
      return onClose();
    }
    return setCommentError(`There was an error...`);
  };

  const handleConceptChange = (x) => {
    setConcept(x);
  };
  const handleCinemaChange = (x) => {
    setCinema(x);
  };
  const handlePerformChange = (x) => {
    setPerform(x);
  };
  const handleRatingChange = (x) => {
    setRating(x);
  };

  return (
    <>
      <Button
        variant="ghost"
        width={inNav ? '' : 'full'}
        colorScheme="purple"
        mr={isAdmin ? 0 : 3}
        leftIcon={<AddIcon />}
        onClick={() => onOpen()}
      >
        Add review
      </Button>

      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        id={'review-modal'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading fontSize="2xl" fontWeight="semibold">
              Add a review
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel mb={3} fontSize="1.1em" fontWeight="semibold">
                Select film
              </FormLabel>
              <Select
                bg={useColorModeValue('white', 'gray.700')}
                placeholder={movie?.name || 'No Film Selected'}
                onChange={(e) => {
                  e.preventDefault();
                  const movieFound = movies.filter(
                    (mv) => mv?.name === e.target.value
                  )[0];
                  if (!movieFound) {
                    return setMovieError(`Please select a valid film!`);
                  }
                  setMovieError(``);
                  return setMovie(movieFound);
                }}
              >
                {movies &&
                  movies?.map((_: MovieType) =>
                    movie?.name !== _.name ? (
                      <option key={_.name}>{_.name}</option>
                    ) : (
                      ''
                    )
                  )}
              </Select>
              {movieError && (
                <Text color={colorMode === 'light' ? `red.600` : `red.300`}>
                  {movieError}
                </Text>
              )}

        <Accordion defaultIndex={0} allowToggle>
          <AccordionItem>
            <AccordionButton>
              <FormLabel my={3}>
                <Flex justifyContent="space-between">
                  <Box><Text fontSize="1.1em" fontWeight="semibold">
                    Concept
                  </Text></Box><Spacer />
                  <Box><Text color={useColorModeValue(`gray.600`, `gray.400`)}>
                    {concept}/10
                  </Text></Box><Spacer />
                  <Box><AccordionIcon /></Box>
                </Flex>
              </FormLabel>
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Box>
                <Flex>
                  <NumberInput
                    max={10}
                    min={0}
                    inputMode="decimal"
                    step={0.1}
                    maxW="100px"
                    mr="2rem"
                    value={concept}
                    onChange={handleConceptChange}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Slider
                    min={0}
                    max={10}
                    step={0.5}
                    flex="1"
                    focusThumbOnChange={false}
                    value={concept}
                    onChange={handleConceptChange}
                  >
                    <SliderTrack>
                      <SliderFilledTrack
                        bg={useColorModeValue(`cyan.500`, `cyan.300`)}
                      />
                    </SliderTrack>
                    <SliderThumb fontSize="sm" boxSize={6}>
                      <Box
                        color={useColorModeValue(`cyan.500`, `cyan.500`)}
                        as={AiFillBulb}
                      />
                    </SliderThumb>
                  </Slider>
                </Flex>
              </Box>
            </AccordionPanel>
          </AccordionItem>

        


        <AccordionItem>
            <AccordionButton>
              <FormLabel my={3}>
                <Flex justifyContent="space-between">
                  <Text fontSize="1.1em" fontWeight="semibold">
                    Cinematography
                  </Text>
                  <Text color={useColorModeValue(`gray.600`, `gray.400`)}>
                    {cinema}/10
                  </Text>
                </Flex>
              </FormLabel>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Box>
                <Flex>
                  <NumberInput
                    max={10}
                    min={0}
                    inputMode="decimal"
                    step={0.1}
                    maxW="100px"
                    mr="2rem"
                    value={cinema}
                    onChange={handleCinemaChange}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Slider
                    min={0}
                    max={10}
                    step={0.5}
                    flex="1"
                    focusThumbOnChange={false}
                    value={cinema}
                    onChange={handleCinemaChange}
                  >
                    <SliderTrack>
                      <SliderFilledTrack
                        bg={useColorModeValue(`yellow.500`, `yellow.300`)}
                      />
                    </SliderTrack>
                    <SliderThumb fontSize="sm" boxSize={6}>
                      <Box
                        color={useColorModeValue(`yellow.500`, `yellow.500`)}
                        as={BsFillCameraVideoFill}
                      />
                    </SliderThumb>
                  </Slider>
                </Flex>
              </Box>
              </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
              <AccordionButton>

              <FormLabel my={3}>
                <Flex justifyContent="space-between">
                  <Text fontSize="1.1em" fontWeight="semibold">
                    Performance
                  </Text>
                  <Text color={useColorModeValue(`gray.600`, `gray.400`)}>
                    {perform}/10
                  </Text>
                </Flex>
              </FormLabel>
              <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
              <Box>
                <Flex>
                  <NumberInput
                    max={10}
                    min={0}
                    inputMode="decimal"
                    step={0.1}
                    maxW="100px"
                    mr="2rem"
                    value={perform}
                    onChange={handlePerformChange}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Slider
                    min={0}
                    max={10}
                    step={0.5}
                    flex="1"
                    focusThumbOnChange={false}
                    value={perform}
                    onChange={handlePerformChange}
                  >
                    <SliderTrack>
                      <SliderFilledTrack
                        bg={useColorModeValue(`red.500`, `red.300`)}
                      />
                    </SliderTrack>
                    <SliderThumb fontSize="sm" boxSize={6}>
                      <Box
                        color={useColorModeValue(`red.500`, `red.500`)}
                        as={FaTheaterMasks}
                      />
                    </SliderThumb>
                  </Slider>
                </Flex>
              </Box>
              </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
            <AccordionButton>


              <FormLabel my={3}>
                <Flex justifyContent="space-between">
                  <Text fontSize="1.1em" fontWeight="semibold">
                    Overall Rating
                  </Text>
                  <Text color={useColorModeValue(`gray.600`, `gray.400`)}>
                    {rating}/10
                  </Text>
                </Flex>
              </FormLabel>
              <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
              <Box>
                <Flex>
                  <NumberInput
                    max={10}
                    min={0}
                    inputMode="decimal"
                    step={0.1}
                    maxW="100px"
                    mr="2rem"
                    value={rating}
                    onChange={handleRatingChange}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Slider
                    min={0}
                    max={10}
                    step={0.5}
                    flex="1"
                    focusThumbOnChange={false}
                    value={rating}
                    onChange={handleRatingChange}
                  >
                    <SliderTrack>
                      <SliderFilledTrack
                        bg={useColorModeValue(`purple.500`, `purple.300`)}
                      />
                    </SliderTrack>
                    <SliderThumb fontSize="sm" boxSize={6}>
                      <Box
                        color={useColorModeValue(`purple.500`, `purple.300`)}
                        as={AiFillHeart}
                      />
                    </SliderThumb>
                  </Slider>
                </Flex>
              </Box>
              </AccordionPanel>
              </AccordionItem>
            </Accordion>

              <Text my={3}>Enter a comment!</Text>
              <Textarea
                value={comment}
                onChange={(e) => {
                  e.preventDefault();

                  if (
                    (e.target.value?.length > 300 ||
                      e.target.value?.length < 10) &&
                    e.target.value.length !== 0
                  ) {
                    setCommentError(
                      `Comment needs to be more than 10 characters and less than 300`
                    );
                  } else {
                    setCommentError(``);
                  }
                  return setComment(e.target.value);
                }}
                placeholder="This film was great because it was..."
                resize="vertical"
              />
              {commentError && (
                <Text color={colorMode === 'light' ? `red.600` : `red.300`}>
                  {commentError}
                </Text>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter
            bg={useColorModeValue(`gray.100`, `gray.800`)}
            borderBottomRadius="md"
          >
            <Button
              colorScheme="purple"
              mr={3}
              onClick={(e) => handleSubmit(e, onClose)}
              isDisabled={!!(commentError || movieError)}
            >
              Submit Review
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
