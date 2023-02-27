import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
import {addAssets,getRfidAssets,Checktoken} from "../../services/apiservice"
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
import { RfidAssets } from "../../model/model";
// ----------------------------------------------------------------------

const NewAsset: React.FC = () => {
  const navigate = useNavigate();

  const [token, settoken] = useState("");

  const { control, handleSubmit } = useForm({
    reValidateMode: "onBlur"
  });

  const [ RfidAssets,SetRfidAssets ] = useState<RfidAssets[]>([]);

  const myHelper:any = {
    asset:{
      required: "Name Assets is Required"
    },
    rfid:{
      required: "Please Select Rfid Address"
    },
    expiration:{
      required: "Expiration time is Required"
    }
  };

  const handleGetRfid=async(token:string)=>{
    SetRfidAssets(await getRfidAssets("/Rfid/SelectRfidAsset"))
  }

  const handleOnSubmit=async(data:any)=>{
    await addAssets("/Asset/AddAsset",token,data.nameassets,data.rfid,data.expirehour)
  }

 

  // const handleSubmit=async(e: React.MouseEvent<HTMLButtonElement>)=>{
  //   e.preventDefault();
  //   await addAssets(token,nameassets,expirehour)
  // }


  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      handleGetRfid(user.token)
      settoken(user.token)
    }
    else{
      navigate('/login')
    }
  },[]);
  return (
    <>
      <Helmet>
          <title> Asset: New | SmartSocket </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5,mt:2 }}>
          <Typography variant="h4" gutterBottom>
            Create a new asset
          </Typography>
        </Stack>
        <Box sx={{ minWidth: 120 }} component="form" onSubmit={handleSubmit(handleOnSubmit)}>
          <Stack spacing={3} mb={3}>
          <Controller
              control={control}
              name="nameassets"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                {...field}
                label="Name Assets"
                type="text"
                // onChange={(e) => {
                //   SetRoom(e.target.value);
                // }}
                error={error !== undefined}
                helperText={error ? myHelper.asset[error.type] : ""}
              />
              )}
            />

          <Controller
              control={control}
              name="rfid"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl error={error !== undefined} fullWidth>
                <InputLabel id="demo-simple-select-label">Rfid</InputLabel>
                  <Select 
                  {...field}
                  fullWidth
                  labelId="demo-simple-select-label"
                  label="Rfid"
                  error={error !== undefined}
                   >
                    <MenuItem
                      value=""
                    >
                      <em>None</em>
                    </MenuItem>
                {RfidAssets.map((inputnode) => {
                  return (
                    <MenuItem
                      value={inputnode.Rfid_rfid_address}
                      key={inputnode.Rfid_rfid_address}
                    >
                      {inputnode.Rfid_rfid_address}
                    </MenuItem>
                  );
                })}
                   </Select>
                <FormHelperText>{error ? myHelper.rfid[error.type] : ""}</FormHelperText>
                </FormControl>
              )}
            />

          <Controller
              control={control}
              name="expirehour"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  type="number"
                  fullWidth
                  label="Expiration time"
                  error={error !== undefined}
                  helperText={error ? myHelper.expiration[error.type] : ""}
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
export default NewAsset;
