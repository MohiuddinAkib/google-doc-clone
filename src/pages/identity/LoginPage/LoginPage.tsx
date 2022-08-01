import React from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useGoogleLoginMutation, useLoginMutation } from '@data/laravel/services/api'
import { Button, TextField, FormHelperText, Box, Card, CardContent, CardActions } from '@material-ui/core'

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const [loginUser, { isLoading }] = useLoginMutation()
    const [loginWithGgl, { isLoading: isGglLoading }] = useGoogleLoginMutation()

    const doSubmit = handleSubmit((values) => {
        loginUser(values)
    })

    const handleGoogleLogin = () => {
        loginWithGgl()
    }

    return (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} height={"100%"}>
            <Card style={{ width: 500 }}>
                <form onSubmit={doSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <CardContent>
                        <div>
                            <TextField
                                fullWidth
                                label={"Email"}
                                type={"email"}
                                {...register("email", {
                                    required: "This field is required",
                                })}
                            />
                            <ErrorMessage errors={errors} name={"email"} render={({ message }) => <FormHelperText error >{message}</FormHelperText>} />
                        </div>

                        <div>
                            <TextField
                                fullWidth
                                label={"Password"}
                                type={"password"}
                                {...register("password", {
                                    required: "This field is required",
                                    min: {
                                        message: "Length must be at least 6",
                                        value: 6
                                    }
                                })}
                            />
                            <ErrorMessage errors={errors} name={"password"} render={({ message }) => <FormHelperText error>{message}</FormHelperText>} />
                        </div>


                    </CardContent>
                    <CardActions>
                        <Button variant={"contained"} type={"submit"} disabled={isLoading}>Login</Button>

                        <Box>
                            <Button type={"button"} disabled={isGglLoading} onClick={handleGoogleLogin} color={"secondary"} variant={"contained"}>Login with google</Button>
                        </Box>
                    </CardActions>
                </form>
            </Card>
        </Box>
    )
}

export default LoginPage