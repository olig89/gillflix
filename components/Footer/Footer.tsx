import {
  Box,
  chakra,
  Link as ChakraLink,
  Stack,
  Tooltip,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
import React from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { getSecondaryAccentColor } from 'utils/utils';

const SocialIcons = ({
  children,
  href,
  label,
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) => {
  return (
    <Tooltip label={label} placement="top">
      <chakra.button
        bg={useColorModeValue(`blackAlpha.100`, `whiteAlpha.100`)}
        rounded="full"
        w={8}
        h={8}
        cursor="pointer"
        as="a"
        href={href}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        transition="background 0.3s ease"
        _hover={{
          bg: useColorModeValue(`blackAlpha.200`, `whiteAlpha.200`),
        }}
      >
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    </Tooltip>
  );
};
export const Footer: React.FC = (): React.ReactElement => {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';

  return (
    <>
      <Box as="footer" role="contentinfo" mt={8} py="6">
        <Stack
          direction={{ base: `column`, md: `row` }}
          maxW={{ base: `xl`, md: `7xl` }}
          mx="auto"
          px={{ base: `6`, md: `0` }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Link href="/" passHref>
            <chakra.a
              ml={{ base: `0`, md: 5 }}
              aria-current="page"
              aria-label="Back to Home page"
              rel="home"
            >
              <h1>{siteName}</h1>
            </chakra.a>
          </Link>

          <Text marginStart={{ md: `auto` }} justifySelf="middle">
            
          </Text>

          <Stack
            direction="row"
            spacing={6}
            ml="auto"
            mr={{ base: `auto`, md: 5 }}
          >
            <SocialIcons label="GitHub" href="https://github.com/olig89/">
              <FaGithub />
            </SocialIcons>
            <SocialIcons
              label="Twitter"
              href="https://twitter.com/gillflix/"
            >
              <FaTwitter />
            </SocialIcons>

            <SocialIcons
              label="Discord"
              href="https://discord.com/invite/h2E8EzFqy5"
            >
              <FaDiscord />
            </SocialIcons>
          </Stack>
        </Stack>
      </Box>
      <ChakraLink
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        color={useColorModeValue('white', 'gray.800')}
        py={1}
        px={3}
        mt={1}
        width="full"
        bg={`${getSecondaryAccentColor()}.${useColorModeValue(500, 300)}`}
        href="https://discord.com/invite/h2E8EzFqy5"
      >
        Join our Discord for spoiler chats, and more!{' '}
        <BsArrowRight
          style={{ display: 'inline-block', marginInlineStart: '15px' }}
        />
      </ChakraLink> 
    </>
  );
};
