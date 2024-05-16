import { IUserInformation } from "@/types/user";
import { DescriptionsProps, Flex, Typography } from "antd";

const { Text } = Typography;

const ViewUserDescription = (data: IUserInformation): DescriptionsProps['items'] => {
  const items: DescriptionsProps['items'] = [
    {
      label: 'First name',
      span: 2,
      children: data.firstName,
    },
    {
      label: 'Last name',
      span: 2,
      children: data.lastName,
    },
    {
      label: 'Address',
      span: 4,
      children: data.address,
    },
    {
      label: 'Roles',
      span: 4,
      children: 2
    }
  ];
  
  
  return items;
};

export default ViewUserDescription;
