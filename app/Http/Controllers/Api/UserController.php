<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Log;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

// use Spatie\QueryBuilder\QueryBuilder;
// use Spatie\QueryBuilder\AllowedFilter;

class UserController extends Controller
{
    public static function Routes()
    {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::post('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return UserResource::collection(User::orderByDesc('id')->get());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users,username',
            'name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->symbols()
            ]
        ]);
        if($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'username' => $request->username,
            'name' => $request->name,
            'password' => bcrypt($request->password),
            'email' => $request->email,
            'address' => $request->address,
            'mobile' => $request->mobile
        ]);

        return response(new UserResource($user), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users,username,' . $id,
            'name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'confirmed|min:8'
        ]);
        if($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::find($id);
        $user_password = $user->password;
        if($request->password) {
            $user_password = bcrypt($request->password);
        }
        $avatar = $user->avatar;
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar')->store('public/avatars');
            $avatar = str_replace('public/', '', $avatar);
        }
        $user->update([
            'username' => $request->username,
            'name' => $request->name,
            'password' => $user_password,
            'email' => $request->email,
            'address' => $request->address,
            'mobile' => $request->mobile,
            'avatar' => $avatar
        ]);
        Log::create([
            'slug' => 'update',
            'model' => (new User)->getTable(),
            'user_id' => Auth::user()->id,
            'username' => Auth::user()->username,
            'detail' => json_encode(array('id' => $user->id, 'username' => $user->username))
        ]);
        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        User::find($id)->delete();
        return response("", 204);
    }
}
