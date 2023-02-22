import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
import { addMatching, SelectMatchNode, Checktoken, getMatchAssets } from "../../services/apiservice"
import {
  Typography,
  Container,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Stack,
  Button,
  FormHelperText
} from "@mui/material";
import { Controller,useForm } from 'react-hook-form';
import { NodeSelection, MatchAsset } from "../../model/model";
// ----------------------------------------------------------------------

const NewMatch: React.FC = () => {
  const navigate = useNavigate();

  const [inputassets, setInputassets] = useState<string>("0");

  const [listnode, setlistnode] = useState<NodeSelection[]>([]);

  const [listassets, setlistassets] = useState<MatchAsset[]>([]);

  const [token, settoken] = useState("");

  const { control, handleSubmit } = useForm({
    reValidateMode: "onBlur"
  });


  const myHelper:any = {
    asset:{
      required: "Please Select Asset"
    },
    node:{
      required: "Please Select Node"
    },
    room:{
      required: "Room is Required"
    },
    floor:{
      required: "Floor is Required"
    }
  };

  const ComponentMatch= async (token:string) => {
    setlistassets(await getMatchAssets(token));
  }

  const Getnode = async (id:string) => {
    console.log(typeof(id))
    setlistnode(await SelectMatchNode(id));
  };

  const handleOnSubmit=async(data:any)=>{
    await addMatching(token,data.asset,data.node,data.room,data.floor)
    navigate('/app/match/list')
  }

  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      ComponentMatch(user.token);
      settoken(user.token)
    }
    else{
      navigate('/login')
    }
  },[]);
  return (
    <>
      <Helmet>
          <title> Matching: New | SmartSocket </title>
      </Helmet>
      <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5,mt:2 }}>
          <Typography variant="h4" gutterBottom>
            Create a new match
          </Typography>
        </Stack>
        <Box sx={{ minWidth: 120 }} component="form" onSubmit={handleSubmit(handleOnSubmit)}>
          <Stack spacing={3} mb={3}>

          <Controller
              control={control}
              name="asset"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl error={error !== undefined} fullWidth>
                <InputLabel id="demo-simple-select-label">Assets</InputLabel>
                  <Select 
                  fullWidth
                  labelId="demo-simple-select-label"
                  label="Assets"
                  {...field}
                  onChange={(e) => {
                    field.onChange(parseInt(e.target.value))
                    setInputassets(e.target.value);
                    Getnode(e.target.value);
                  }}
                   >
                    <MenuItem
                      value=""
                    >
                      <em>None</em>
                    </MenuItem>
                {listassets.map((inputassets) => {
                  return (
                    <MenuItem
                      value={inputassets.Assets_id_assets}
                      key={inputassets.Assets_id_assets}
                    >
                      {inputassets.Assets_name_assets}
                    </MenuItem>
                  );
                })}
                   </Select>
                <FormHelperText>{error ? myHelper.asset[error.type] : ""}</FormHelperText>
                </FormControl>
              )}
            />

          <Controller
              control={control}
              name="node"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl error={error !== undefined} fullWidth>
                <InputLabel id="demo-simple-select-label">Node</InputLabel>
                  <Select 
                  {...field}
                  fullWidth
                  labelId="demo-simple-select-label"
                  // value={inputnode}
                  label="Node"
                  // onChange={handleChangeNode} 
                  error={error !== undefined}
                   >
                    <MenuItem
                      value=""
                    >
                      <em>None</em>
                    </MenuItem>
                {listnode.map((inputnode) => {
                  return (
                    <MenuItem
                      value={inputnode.Node_mac_address}
                      key={inputnode.Node_mac_address}
                    >
                      {inputnode.Node_mac_address}
                    </MenuItem>
                  );
                })}
                   </Select>
                <FormHelperText>{error ? myHelper.node[error.type] : ""}</FormHelperText>
                </FormControl>
              )}
            />

          <Controller
              control={control}
              name="room"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                {...field}
                label="Room"
                type="text"
                // onChange={(e) => {
                //   SetRoom(e.target.value);
                // }}
                error={error !== undefined}
                helperText={error ? myHelper.room[error.type] : ""}
              />
              )}
            />

          <Controller
              control={control}
              name="floor"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  label="Floor"
                  // onChange={(e) => {
                  //   SetFloor(e.target.value);
                  // }}
                  error={error !== undefined}
                  helperText={error ? myHelper.floor[error.type] : ""}
                />
              )}
            />
            <Button variant="contained" type="submit">
                Add Matching
            </Button>
          </Stack>        
        </Box>
      </Container>
    </>
  );
};
export default NewMatch;
