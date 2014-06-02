package com.bitshift.parsing.parsers;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.IOException;

import java.net.Socket;

import com.bitshift.parsing.symbols.Symbols;
import com.bitshift.parsing.utils.PackableMemory;

public abstract class Parser implements Runnable {

    protected Socket clientSocket;

    public Parser(Socket clientSocket) {
        this.clientSocket = clientSocket;
    }

    protected String readFromClient() {
        String fromClient = "";

        try {
            BufferedReader clientReader = new BufferedReader(
                    new InputStreamReader(this.clientSocket.getInputStream()));

            int bytes = Integer.parseInt(clientReader.readLine());

            StringBuilder builder = new StringBuilder();
            int i = 0;

            while(i < bytes) {
                char aux = (char)clientReader.read();
                builder.append(aux);
                i++;
            }

            fromClient = builder.toString();

        } catch (IOException ex) {
        }

        return fromClient;
    }

    protected void writeToClient(String toClient) {
        try {
            BufferedWriter clientWriter = new BufferedWriter(
                    new OutputStreamWriter(this.clientSocket.getOutputStream()));

            PackableMemory mem = new PackableMemory(4);
            mem.pack(toClient.length(), 0);
            String dataSize = new String(mem.mem);

            clientWriter.write(dataSize + toClient);
            clientWriter.flush();
            this.clientSocket.close();
        } catch (IOException ex) {
        }
    }

    protected abstract Symbols genSymbols();

    public abstract void run();

}

