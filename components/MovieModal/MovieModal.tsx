import React, { FormEvent, useEffect, useState } from 'react';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';

import { AddIcon, SearchIcon } from '@chakra-ui/icons';

import { useQueryClient } from 'react-query';
import SearchResults from '../SearchResults';
import { OMDBMovie, OMDBResponse } from '../../pages/api/movie-api';

export const MovieModal: React.FC<{ inMobileNav?: boolean }> = ({
  inMobileNav = false,
}): React.ReactElement => {
  const [results, setResults] = useState<OMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(``);
  const [success, setSuccess] = useState<{ type: string; data: any } | null>(
    null
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  useEffect(() => {
    if (success) {
      queryClient.invalidateQueries(`movies`).catch(console.error);
      toast({
        variant: `solid`,
        title: success.type === `addition` ? `Film Added` : `Film Deleted`,
        description:
          success.type === `addition`
            ? `${success.data?.name} was successfully added`
            : `${success.data.name} was successfully deleted`,
        status: `success`,
        duration: 5000,
        isClosable: true,
      });
      onClose();
      setSuccess(null);
    } else if (error) {
      toast({
        variant: `solid`,
        title: `There was an error`,
        description: error,
        status: `error`,
        duration: 5000,
        isClosable: true,
      });
      setSuccess(null);
      setError('');
    }
  }, [success, error, onClose, queryClient, toast]);

  interface FormFields {
    0: HTMLInputElement;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) setError(``);
    setLoading(true);
    const target = e.target as typeof e.target & FormFields;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URI}/api/movie-api?search=${target['0'].value}`
      );
      const data: OMDBResponse = await response.json();
      if (response.status !== 200) {
        console.error(data.status_message);
        return setError(data.status_message || 'An error occurred');
      }
      setLoading(false);
      if (!data?.results?.length) {
        setError(`No results found :(`);
      }
      setResults(data.results.splice(0, 5));
    } catch (err) {
      console.error(err);
      if (err) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <>
      {inMobileNav ? (
        <Button
          variant="ghost"
          width="95%"
          mx="auto"
          mt={2}
          leftIcon={<AddIcon />}
          onClick={onOpen}
        >
          Add film
        </Button>
      ) : (
        <Button
          variant="solid"
          colorScheme={process.env.COLOR_THEME}
          mr={3}
          leftIcon={<AddIcon />}
          onClick={onOpen}
        >
          Add film
        </Button>
      )}

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a film</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Find film</FormLabel>
                <Flex>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      ref={initialRef}
                      name="movie"
                      type="text"
                      placeholder="Search OMDB..."
                    />
                  </InputGroup>
                  <Button
                    type="submit"
                    ml={5}
                    colorScheme={process.env.COLOR_THEME}
                  >
                    Search
                  </Button>
                </Flex>
              </FormControl>
            </form>

            {results ? (
              <SearchResults
                data={results}
                loading={loading}
                error={error}
                setSuccess={setSuccess}
                setError={setError}
              />
            ) : (
              ``
            )}
          </ModalBody>

          <ModalFooter
            bg={useColorModeValue(`gray.50`, `gray.800`)}
            roundedBottom="md"
          >
            <Button colorScheme={process.env.COLOR_THEME} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
