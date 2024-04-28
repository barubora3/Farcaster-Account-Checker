import {
  Avatar,
  Table,
  TableData,
  Container,
  Center,
  Title,
  Text,
  Flex,
  Button,
  Box,
  Modal,
} from "@mantine/core";
import { db, firebase } from "../lib/firebase";
import { chainOptions, AlchemyChainNames, ChainName } from "../lib/chain";
import { PieChartComponent } from "../components/PieChartComponent";
const tableData: TableData = {
  caption: "",
  head: ["Icon", "Name", "Address", "Follower", "Following"],
  body: [],
};

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY!;

const fetchOptions = { method: "GET", headers: { accept: "application/json" } };

const neynarOptions = {
  method: "GET",
  headers: { accept: "application/json", api_key: NEYNAR_API_KEY },
};

type FirebaseType = {
  label: string;
  icon: string;
  collectionSlug: string;
  walletAddressList: string[];
  body: any;
  updatedAt: number;
};

interface User {
  pfp_url: string;
  display_name: string;
  follower_count: number;
  following_count: number;
  fid: string;
  username: string;
}

interface ResponseData {
  [key: string]: User[];
}
export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const checkAndRestoreData = async (): Promise<{
    hasData: boolean;
    data?: FirebaseType;
  }> => {
    const chain = searchParams?.chain;
    const contractAddress = searchParams?.contractAddress;
    const key = `${chain}:${contractAddress}`;
    const ref = db.ref(`collection/${key}`);

    try {
      const snapshot = await ref.once("value");
      const data = snapshot.val();

      if (data) {
        return { hasData: true, data: data as FirebaseType };
      }
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
    }

    return { hasData: false };
  };

  const getCollectionInfo = async () => {
    const chain = searchParams?.chain;
    const contractAddress = searchParams?.contractAddress;

    const url = `https://${
      AlchemyChainNames[chain as ChainName]
    }.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getContractMetadata?contractAddress=${contractAddress}`;
    const response = await fetch(url, fetchOptions);
    const contractData = await response.json();
    const label = contractData.name;
    const icon = contractData.openSeaMetadata.imageUrl;
    const collectionSlug = contractData.openSeaMetadata.collectionSlug;

    return { label, icon, collectionSlug };
  };

  const getWalletAddressList = async () => {
    const chain = searchParams?.chain;
    const contractAddress = searchParams?.contractAddress;

    const url = `https://${
      AlchemyChainNames[chain as ChainName]
    }.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getOwnersForContract?contractAddress=${contractAddress}&withTokenBalances=false`;
    const response = await fetch(url, fetchOptions);
    const ownerData = await response.json();
    const walletAddressList = ownerData.owners;

    return walletAddressList;
  };

  const analyze = async () => {
    tableData.body = [];
    const chunkSize = 350;
    let chunks = [];

    for (let i = 0; i < walletAddressList.length; i += chunkSize) {
      const chunk = walletAddressList.slice(i, i + chunkSize);
      chunks.push(chunk);
    }

    // テスト用
    // chunks = chunks.slice(0, 2);
    // console.log(chunks);

    const responses = await Promise.all(
      chunks.map(async (chunk) => {
        const response = await fetch(
          "https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=" +
            chunk.join(","),
          neynarOptions
        );
        return response.json();
      })
    );

    const data = responses
      .flatMap((response) => Object.entries(response))
      .reduce((acc, [key, value]) => {
        acc[key] = value as User[]; // Explicitly type value as User[]
        return acc;
      }, {} as ResponseData);

    Object.keys(data).forEach((key: string) => {
      const user = data[key];
      tableData.body?.push([
        user[0].pfp_url,
        user[0].display_name,
        key,
        user[0].follower_count,
        user[0].following_count,
        user[0].fid,
        user[0].username,
      ]);
    });

    return data;
  };

  const registerData = async () => {
    const chain = searchParams?.chain;
    const contractAddress = searchParams?.contractAddress;
    const key = `${chain}:${contractAddress}`;
    const ref = db.ref(`collection/${key}`);

    const data = {
      label: label,
      icon: icon,
      collectionSlug: collectionSlug,
      walletAddressList: walletAddressList,
      body: tableData.body,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    };
    try {
      await ref.set(data);
      const snapshot = await ref.once("value");
      const registeredData = snapshot.val();
      return registeredData.updatedAt as number;
    } catch (error) {
      console.error("Error saving data to Firebase:", error);
      return 0;
    }
  };

  let label = "";
  let icon = "";
  let collectionSlug = "";
  let walletAddressList: string[] = [];
  let farcasterUsers: any = [];
  let updateAt = 0;
  // firebaseにデータが存在するかチェック
  const registerdData = await checkAndRestoreData();

  if (registerdData.hasData && registerdData.data) {
    label = registerdData.data.label;
    icon = registerdData.data.icon || "";
    collectionSlug = registerdData.data.collectionSlug;
    walletAddressList = registerdData.data.walletAddressList;
    tableData.body = registerdData.data.body;
    updateAt = registerdData.data.updatedAt;
  } else {
    const collection = await getCollectionInfo();
    label = collection.label;
    icon = collection.icon;
    collectionSlug = collection.collectionSlug;
    walletAddressList = await getWalletAddressList();
    farcasterUsers = await analyze();
    const registerTime = await registerData();
    updateAt = registerTime;
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <>
      <Container>
        <a
          target="_blank"
          href={"https://opensea.io/collection/" + collectionSlug}
        >
          <Center pt={20}>
            <Avatar
              src={icon}
              alt="icon"
              className="mr-2 inline-block align-middle"
            />
            <Title>{label}</Title>
          </Center>
        </a>
        <Center>
          <PieChartComponent
            x={tableData.body?.length || 0}
            y={walletAddressList.length}
          />
        </Center>

        <Center>
          <Button>Share on Warpcast</Button>
          <Box px={8} />
          <Button disabled={true}>Update Result(Upcoming)</Button>
        </Center>

        <Text ta="right" pr={8} pb={4}>
          update at: {formatDate(updateAt)}
        </Text>

        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {tableData?.head?.map((head, index) => (
                <th key={index} className="px-4 py-2 text-left">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.body?.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td key={index} className="px-4 py-2">
                  <a href={"https://warpcast.com/" + row[6]} target="_blank">
                    <Avatar
                      src={row[0] as string}
                      alt="icon"
                      className="mr-2 inline-block align-middle"
                    />
                  </a>
                </td>
                <td className="px-4 py-2">{row[1]}</td>
                <td className="px-4 py-2">{row[2]}</td>
                <td className="px-4 py-2">{row[3]}</td>
                <td className="px-4 py-2">{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </>
  );
}
