<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $user->foto_url = $user->foto_profil ? asset('storage/' . $user->foto_profil) : null;
        
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:100',
            'email' => 'required|email|max:255|unique:user,email,' . $user->id_pengguna . ',id_pengguna',
            'no_telepon' => 'required|string|max:15',
            // 'alamat' => 'nullable|string', <-- DIHAPUS
            'foto_profil' => 'nullable|image|max:2048',
            'password' => 'nullable|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update Data Dasar
        $user->nama = $request->nama;
        $user->email = $request->email;
        $user->no_telepon = $request->no_telepon;
        // $user->alamat = $request->alamat; <-- DIHAPUS

        // Update Password
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // Update Foto
        if ($request->hasFile('foto_profil')) {
            if ($user->foto_profil) {
                Storage::delete('public/' . $user->foto_profil);
            }
            $path = $request->file('foto_profil')->store('public/uploads/profil');
            $user->foto_profil = $path;
        }

        $user->save();

        $user->foto_url = $user->foto_profil ? asset('storage/' . $user->foto_profil) : null;

        return response()->json([
            'message' => 'Profil berhasil diperbarui!',
            'data' => $user
        ]);
    }
}