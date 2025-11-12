import { Input, InputGroup } from "@chakra-ui/react";

import { BsSearch } from "react-icons/bs";

const SearchInput = () => {
  return (
    <form style={{ width: "100%" }}>
      <InputGroup startElement={<BsSearch />}>
        <Input placeholder="Search Events..." />
      </InputGroup>
    </form>
  );
};

export default SearchInput;
