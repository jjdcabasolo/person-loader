import React from 'react'
import axios from 'axios'

import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Home.module.css'

import {
  Button,
  Container,
  Box,
  Center,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react"

import { useInfiniteQuery } from 'react-query'

interface PersonData {
  avatar: string
  email: string
  first_name: string
  id: number
  last_name: string
}

export default function Home() {
  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'projects',
    async ({ pageParam = 1 }) => {
      const res = await axios.get(`https://reqres.in/api/users?page=${pageParam}&per_page=2`)
      return res.data
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.data.length > 0) {
          return lastPage.page + 1
        }

        return undefined
      },
    }
  )

  return (
    <div>
      <Head>
        <title>Person loader</title>
        <meta name="description" content="Loads persons 2 at a time using react-query" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Container>
          <Center paddingBottom={2}>
            <Text fontSize="2xl">Person Loader</Text>
          </Center>

          <Stack spacing={4}>
            {data?.pages.map((page, i) => (
              <HStack key={`page-${i}`} spacing={4}>
                {page.data.map((data: PersonData) => (
                  <Box
                    alignItems="center"
                    borderRadius="lg"
                    borderWidth={1}
                    className={styles.box}
                    d="flex"
                    flexDirection="column"
                    key={`person-${data.id}`}
                    padding={2}
                    w="50%"
                  >
                    <Image
                      alt={`Picture of ${data.first_name} ${data.last_name}`}
                      className={styles.image}
                      height={200}
                      src={data.avatar}
                      width={200}
                    />
                    <Text
                      isTruncated
                      width="100%"
                      textAlign="center"
                    >
                      {`${data.first_name} ${data.last_name}`}
                    </Text>
                    <Text
                      color="blue.300"
                      isTruncated
                      width="100%"
                      textAlign="center"
                    >
                      {data.email}
                    </Text>
                  </Box>
                ))}
              </HStack>
            ))}

            {isFetchingNextPage && (<div>Loading...</div>)}

            {hasNextPage && (
              <Button onClick={() => fetchNextPage()}>
                Load more
              </Button>
            )}
          </Stack>
        </Container>
      </main>
    </div>
  )
}
