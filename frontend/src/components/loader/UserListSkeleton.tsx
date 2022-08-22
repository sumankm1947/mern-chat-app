import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

const UserListSkeleton = () => {
  return (
    <Stack marginTop={4}>
      <Skeleton height="47px" borderRadius="lg" />
      <Skeleton height="47px" borderRadius="lg" />
      <Skeleton height="47px" borderRadius="lg" />
      <Skeleton height="47px" borderRadius="lg" />
      <Skeleton height="47px" borderRadius="lg" />
      <Skeleton height="47px" borderRadius="lg" />
      <Skeleton height="47px" borderRadius="lg" />
      <Skeleton height="47px" borderRadius="lg" />
      <Skeleton height="47px" borderRadius="lg" />
      <Skeleton height="47px" borderRadius="lg" />
      <Skeleton height="47px" borderRadius="lg" />
    </Stack>
  );
};

export default UserListSkeleton;