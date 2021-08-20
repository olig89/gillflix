import { CloseButton, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { useEffect } from 'react';
import { getSecondaryAccentColor } from 'utils/utils';

interface Props {
  message: string;
  title: string;
  storageName: string;
  type: 'error' | 'success';
}

const colors = {
  error: { bg: { light: 'blue.500', dark: 'blue.200' } },
  success: {
    bg: {
      light: `${getSecondaryAccentColor()}.500`,
      dark: `${getSecondaryAccentColor()}.300`,
    },
  },
};

export default function AlertBanner({
  message,
  title,
  type,
  storageName,
}: Props): ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const color = useColorModeValue('white', 'gray.800');
  const bg = useColorModeValue(
    `${colors[type].bg.light}`,
    `${colors[type].bg.dark}`
  );
  useEffect(() => {
    const cookie = window.localStorage.getItem(storageName);

    if (!cookie) {
      setIsOpen(true);
    }
  }, [storageName]);

  const handleDismiss = () => {
    setIsOpen(false);
    window.localStorage.setItem(storageName, 'true');
  };

  return (
    <Flex
      height={isOpen ? '' : '0%'}
      justifyContent="center"
      alignItems={{ base: 'flex-start', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}
      bg={bg}
      px="3"
      py={{ base: isOpen ? 4 : 0, md: '0' }}
      color={color}
    >
      <Text
        visibility={isOpen ? 'visible' : 'hidden'}
        width={{ base: '92%', md: 'auto' }}
        fontWeight="extrabold"
      >
        {title}
      </Text>

      <Text
        ml={{ base: 0, md: 3 }}
        visibility={isOpen ? 'visible' : 'hidden'}
        fontWeight="semibold"
      >
        {message}
      </Text>
      <CloseButton
        mb={'0.3rem'}
        mt={'0.2rem'}
        alignSelf="flex-end"
        display={isOpen ? 'inline-block' : 'none'}
        position={{ base: 'absolute', md: 'static' }}
        top={2}
        onClick={handleDismiss}
        ml={5}
      />
    </Flex>
  );
}
