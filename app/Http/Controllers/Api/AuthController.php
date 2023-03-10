<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Log;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    /**
     * Slug logs
     * - login
     * - create
     * - update
     * - delele
     * - destroy
     * - confirm
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|exists:users,username',
            'password' => 'required|min:8'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $credentials = $request->only(['username', 'password']);
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email adderss or password incorrect'
            ], 422);
        }
        /** @var User $user */
        $user = Auth::user();
        $user->getRoleNames();
        $token = $user->createToken('main')->plainTextToken;

        if(count($user->roles) > 0) {
            $role = Role::findById($user->roles[0]['id']);
            $permissions = $role->getAllPermissions();
        } else {
            $permissions = [];
        }

        Log::create([
            'slug' => 'login',
            'model' => (new User)->getTable(),
            'user_id' => $user->id,
            'username' => $user->username
        ]);

        return response(compact('user', 'token', 'permissions'));
    }

    public function logout(Request $request)
    {
        /** @var User $user */
        // $user = $request->user();
        Auth::user()->currentAccessToken()->delete();
        return response('', 204);
    }
}
